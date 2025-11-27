const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function openDb() {
  return open({
    filename: './chat.db',
    driver: sqlite3.Database
  });
}

async function initDb() {
  const db = await openDb();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      google_id TEXT UNIQUE,
      avatar_url TEXT
    );

    CREATE TABLE IF NOT EXISTS threads (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      title TEXT,
      created_at TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      thread_id TEXT,
      role TEXT,
      content TEXT,
      timestamp TEXT,
      FOREIGN KEY(thread_id) REFERENCES threads(id)
    );
  `);

  return db;
}

module.exports = { openDb, initDb };
