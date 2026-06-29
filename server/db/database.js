const Database = require("better-sqlite3");

const path = require("path");

const db = new Database(path.join(__dirname, "leads.db"));

db.pragma("journal_mode=WAL");

const fs = require("fs");

const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");

db.exec(schema);

console.log("Database initialized.");

module.exports = db;
