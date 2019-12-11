var sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "database.sqlite";

let db = new sqlite3.Database(DBSOURCE, err => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQlite database.");
    db.run(
      `CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            joinTime DATETIME DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT email_unique UNIQUE (email)
            )`,
      err => {
        if (err) {
          // Table already created
        } else {
          // Table just created, creating some rows
          var insert =
            "INSERT INTO users (name, email, password) VALUES (?,?,?)";
          db.run(insert, ["admin", "admin@example.com", "admin123456"]);
          db.run(insert, ["user", "user@example.com", "user123456"]);
        }
      }
    );
  }
});

module.exports = db;
