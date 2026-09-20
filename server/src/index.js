require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./db');
const { seedIfEmpty } = require('./seed');
const { jitterCoordinate } = require('./geo');
const { signToken, requireAuth, requireRole } = require('./auth');

seedIfEmpty();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JITTER_RADIUS_METERS = Number(process.env.JITTER_RADIUS_METERS || 400);
// A driver who stopped sending pings (closed the tab, dead phone) drops off
// the public map after two missed update cycles rather than lingering forever.
const STALE_AFTER_MS = Number(process.env.STALE_AFTER_MS || 12 * 60 * 1000);

function toPublicDriver(row) {
  return {
    id: row.user_id,
    name: row.display_name,
    lat: row.jittered_lat,
    lng: row.jittered_lng,
    updatedAt: row.updated_at,
  };
}

// ---- auth ----

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = signToken(user);
  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role, display_name: user.display_name },
  });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// ---- public (unauthenticated) ----

app.get('/api/public/drivers', (req, res) => {
  const cutoff = new Date(Date.now() - STALE_AFTER_MS).toISOString();
  const rows = db
    .prepare(
      `SELECT ds.user_id, u.display_name, ds.jittered_lat, ds.jittered_lng, ds.updated_at
       FROM driver_state ds
       JOIN users u ON u.id = ds.user_id
       WHERE ds.online = 1
         AND ds.jittered_lat IS NOT NULL
         AND ds.updated_at >= ?`
    )
    .all(cutoff);

  res.json({ drivers: rows.map(toPublicDriver), jitterRadiusMeters: JITTER_RADIUS_METERS });
});

// ---- driver ----

app.post('/api/driver/status', requireAuth, requireRole('driver'), (req, res) => {
  const { online } = req.body || {};
  if (typeof online !== 'boolean') {
    return res.status(400).json({ error: 'online must be a boolean' });
  }

  const existing = db.prepare('SELECT * FROM driver_state WHERE user_id = ?').get(req.user.id);
  if (!existing) {
    db.prepare('INSERT INTO driver_state (user_id, online) VALUES (?, ?)').run(req.user.id, online ? 1 : 0);
  } else if (!online) {
    // Going offline immediately removes the driver from the public map.
    db.prepare(
      `UPDATE driver_state
       SET online = 0, lat = NULL, lng = NULL, jittered_lat = NULL, jittered_lng = NULL, updated_at = NULL
       WHERE user_id = ?`
    ).run(req.user.id);
  } else {
    db.prepare('UPDATE driver_state SET online = 1 WHERE user_id = ?').run(req.user.id);
  }

  res.json({ online });
});

app.post('/api/driver/location', requireAuth, requireRole('driver'), (req, res) => {
  const { lat, lng, accuracy } = req.body || {};
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'lat and lng must be numbers' });
  }

  const jittered = jitterCoordinate(lat, lng, JITTER_RADIUS_METERS);
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO driver_state (user_id, online, lat, lng, jittered_lat, jittered_lng, accuracy, updated_at)
     VALUES (@user_id, 1, @lat, @lng, @jlat, @jlng, @accuracy, @now)
     ON CONFLICT(user_id) DO UPDATE SET
       online = 1, lat = @lat, lng = @lng, jittered_lat = @jlat, jittered_lng = @jlng,
       accuracy = @accuracy, updated_at = @now`
  ).run({
    user_id: req.user.id,
    lat,
    lng,
    jlat: jittered.lat,
    jlng: jittered.lng,
    accuracy: accuracy ?? null,
    now,
  });

  res.json({ ok: true, jittered, jitterRadiusMeters: JITTER_RADIUS_METERS, updatedAt: now });
});

// ---- admin ----

app.get('/api/admin/drivers', requireAuth, requireRole('admin'), (req, res) => {
  const rows = db
    .prepare(
      `SELECT u.id, u.username, u.display_name, ds.online, ds.lat, ds.lng, ds.updated_at
       FROM users u
       LEFT JOIN driver_state ds ON ds.user_id = u.id
       WHERE u.role = 'driver'
       ORDER BY u.display_name`
    )
    .all();

  res.json({
    drivers: rows.map((r) => ({
      id: r.id,
      username: r.username,
      name: r.display_name,
      online: !!r.online,
      lat: r.lat,
      lng: r.lng,
      updatedAt: r.updated_at,
    })),
  });
});

app.post('/api/admin/drivers', requireAuth, requireRole('admin'), (req, res) => {
  const { username, password, displayName } = req.body || {};
  if (!username || !password || !displayName) {
    return res.status(400).json({ error: 'username, password, and displayName are required' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) return res.status(409).json({ error: 'That username is already taken' });

  const info = db
    .prepare('INSERT INTO users (username, password_hash, role, display_name) VALUES (?, ?, ?, ?)')
    .run(username, bcrypt.hashSync(password, 10), 'driver', displayName);
  db.prepare('INSERT INTO driver_state (user_id, online) VALUES (?, 0)').run(info.lastInsertRowid);

  res.status(201).json({ id: info.lastInsertRowid, username, displayName });
});

app.post('/api/admin/drivers/:id/force-offline', requireAuth, requireRole('admin'), (req, res) => {
  db.prepare(
    `UPDATE driver_state
     SET online = 0, lat = NULL, lng = NULL, jittered_lat = NULL, jittered_lng = NULL, updated_at = NULL
     WHERE user_id = ?`
  ).run(req.params.id);
  res.json({ ok: true });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`driver-space API listening on http://localhost:${PORT}`);
});
