const express = require("express");
const path = require("path");
const app = express();
var bodyParser = require("body-parser");
var history = require("connect-history-api-fallback");
var fs = require("fs");
var data = [];
var cors = require("cors");
var db = require("./database.js");

var user = "admin@gmail.com";
var password = "1234";

app.use(
  cors({
    origin: ["http://localhost:8081", "http://localhost:80"], //允許這個域的訪問
    methods: ["GET", "POST"], //只允許GET和POST請求
    alloweHeaders: ["Conten-Type", "Authorization"] //只允許帶這兩種請求頭的連接方式
  })
);

app.use(history());
app.use(express.static(path.join(__dirname, "dist")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/api/users", function(req, res) {
  var sql = "select * from users";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows
    });
  });
});

app.post("/api/addUser", function(req, res) {
  var errors = [];
  if (!req.body.userName) {
    errors.push("No username specified");
  }
  if (!req.body.userPassword) {
    errors.push("No password specified");
  }
  if (!req.body.userEmail) {
    errors.push("No email specified");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }
  var data = {
    name: req.body.userName,
    email: req.body.userEmail,
    password: req.body.userPassword
  };
  var sql = "INSERT INTO users (name, email, password) VALUES (?,?,?)";
  var params = [data.name, data.email, data.password];
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
      id: this.lastID
    });
  });
});

app.post("/api/loginCheck", (req, res, next) => {
  let sql = `SELECT * FROM users WHERE name = "${req.body.userName}"`;

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).send("Bad Database Request!");
      return;
    }
    if (rows != "") {
      rows.forEach(row => {
        if (row.password == req.body.userPassword) {
          res.status(200).send("Login!");
          return;
        } else {
          res.status(400).send("Wrong Password!");
          return;
        }
      });
    } else {
      res.status(400).send("Wrong UserName");
      return;
    }
  });
});
app.post("/api/getModify", (req, res, next) => {
  let sql = `SELECT * FROM users WHERE name = "${req.body.userName}"`;

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).send("Bad Database Request!");
      return;
    }
    rows.forEach(row => {
      res.status(200).json(row);
    });
  });
});

app.post("/api/modify", (req, res, next) => {
  let sql = `UPDATE users
            SET password="${req.body.userPassword}",
            email="${req.body.userEmail}"
            WHERE name = "${req.body.userName}"`;

  db.run(sql, err => {
    if (err) {
      res.status(500);
      return console.error(err.message);
    } else {
      res.status(200).send("OK");
      return;
    }
  });
});

app.post("/api/db_select", function(req, res) {
  var userName = req.body.userName;
  let sql = `SELECT * FROM events WHERE onwer = "${userName}"`;
  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).send("Bad Database Request!");
      return;
    }
    res.send(rows);
  });
});

app.post("/api/db_add", function(req, res) {
  var insert =
    "INSERT INTO events (name, start,end,detail,color,onwer,share) VALUES (?,?,?,?,?,?,?)";
  db.run(
    insert,
    [
      req.body.event.name,
      req.body.event.start,
      req.body.event.end,
      req.body.event.detail,
      req.body.event.color,
      req.body.userName,
      ""
    ],
    function(err) {
      if (err) throw err;
      else {
        res.status(200).send("OK");
        return;
      }
      //
    }
  );
});

app.post("/api/db_delete", function(req, res) {
  let sql = `DELETE FROM events WHERE id = "${req.body.eventId}"`;
  db.all(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send("Bad Database Request!");
      return;
    }
    res.status(200).send("OK");
  });
});
app.post("/api/db_update", function(req, res) {
  let sql = `UPDATE events
            SET name="${req.body.newEvent.name}",
            detail="${req.body.newEvent.details}",
            start="${req.body.newEvent.start}",
            end="${req.body.newEvent.end}",
            color="${req.body.newEvent.color}"
            WHERE id = "${req.body.oldEvent.id}"`;
  console.log(sql);
  db.run(sql, err => {
    if (err) {
      res.status(500);
      return console.error(err.message);
    } else {
      res.status(200).send("OK");
      return;
    }
  });
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || "0.0.0.0";
app.listen(server_port, server_host, function() {
  console.log("Listening on port %d", server_port);
});
