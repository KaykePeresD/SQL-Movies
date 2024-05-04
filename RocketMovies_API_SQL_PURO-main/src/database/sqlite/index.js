const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const path = require('path');

async function sqliteConnection() {
  const db = await sqlite.open({
    filename: path.resolve(__dirname, '..', 'db.db'),
    driver: sqlite3.Database
  });

  await db.run('PRAGMA foreign_keys = ON');

  return db;
}

module.exports = sqliteConnection; 