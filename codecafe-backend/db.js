const sqlite3 = require("sqlite3").verbose();

// התחברות למסד הנתונים
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error connecting to SQLite:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// יצירת טבלה אם היא לא קיימת
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS meetups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL
    )
  `);
});

module.exports = db;
