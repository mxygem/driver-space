const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'driver-space.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('driver','admin')),
    display_name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS driver_state (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    online INTEGER NOT NULL DEFAULT 0,
    lat REAL,
    lng REAL,
    jittered_lat REAL,
    jittered_lng REAL,
    accuracy REAL,
    updated_at TEXT
  );
`);

module.exports = db;
