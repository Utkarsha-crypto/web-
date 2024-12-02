const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./pricing.db');

// Create pricing table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS pricing (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      storeId TEXT NOT NULL,
      sku TEXT NOT NULL,
      productName TEXT NOT NULL,
      price REAL NOT NULL,
      date TEXT NOT NULL
    )
  `);
});

module.exports = db;
