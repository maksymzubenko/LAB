const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../../data/app.db");

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON");
});

db.exec("PRAGMA foreign_keys = ON;");

module.exports = db;