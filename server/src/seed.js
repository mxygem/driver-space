const bcrypt = require('bcryptjs');
const db = require('./db');

// Seeds a default admin + demo driver account on first run so the app is
// usable immediately. Prints the generated credentials once; change them
// via the admin UI (or DB) afterward.
function seedIfEmpty() {
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM users').get();
  if (count > 0) return;

  const insertUser = db.prepare(
    'INSERT INTO users (username, password_hash, role, display_name) VALUES (?, ?, ?, ?)'
  );
  const insertState = db.prepare(
    'INSERT INTO driver_state (user_id, online) VALUES (?, 0)'
  );

  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const driverPassword = process.env.SEED_DRIVER_PASSWORD || 'driver123';

  const admin = insertUser.run(
    'admin',
    bcrypt.hashSync(adminPassword, 10),
    'admin',
    'Dispatch Admin'
  );

  const driver = insertUser.run(
    'driver1',
    bcrypt.hashSync(driverPassword, 10),
    'driver',
    'Driver One'
  );
  insertState.run(driver.lastInsertRowid);

  console.log('--------------------------------------------------');
  console.log('Seeded default accounts (change these passwords!):');
  console.log(`  admin login  -> username: admin    password: ${adminPassword}`);
  console.log(`  driver login -> username: driver1  password: ${driverPassword}`);
  console.log('--------------------------------------------------');
}

module.exports = { seedIfEmpty };
