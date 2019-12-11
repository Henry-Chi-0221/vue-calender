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
        origin: ["http://localhost:8080", "http://localhost:80"], //允許這個域的訪問
        methods: ["GET", "POST"], //只允許GET和POST請求
        alloweHeaders: ["Conten-Type", "Authorization"] //只允許帶這兩種請求頭的連接方式
    })
);

app.use(history());
app.use(express.static(path.join(__dirname, "dist")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/api/users", function (req, res) {
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

app.post("/api/addUser", function (req, res) {
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
    db.run(sql, params, function (err, result) {
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
                    res.status(200).send('Login!');
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
            SET password="${req.body.usesrPassword}",
            email="${req.body.userEmail}"
            WHERE name = "${req.body.userName}"`;


    db.run(sql, (err) => {
        if (err) {
            res.status(500);
            return console.error(err.message);

        } else {
            res.status(200);
            return;
        }
        

    });



});

/*
app.post("/api/loginCheck", function(req, res) {
  if (req.body.username == user && req.body.password == password) {
    res.sendStatus(200);
    console.log("login success");
  } else {
    res.sendStatus(500);
    console.log("access denied");
  }
});*/
app.post("/api/db_add", function (req, res) {
    fs.readFile("data.json", "utf8", function (err, data) {
        var obj = JSON.parse(data);
        obj.table.push(req.body);
        var json = JSON.stringify(obj);
        fs.writeFile("data.json", json, "utf8", function (err, data) {
            console.log("add success");
        });
        res.send(obj.table);
        //console.log(data);
    });
});

app.post("/api/db_select", function (req, res) {
    fs.readFile("data.json", "utf8", function (err, data) {
        var obj = JSON.parse(data);
        res.send(obj.table);
    });
});
app.post("/api/db_delete", function (req, res) {
    fs.readFile("data.json", "utf8", function (err, data) {
        var obj = JSON.parse(data);
        var index_o = null;
        obj.table.forEach(function (event, index) {
            if (JSON.stringify(event) == JSON.stringify(req.body)) {
                index_o = index;
            }
        });
        if (typeof index_o == "number") {
            obj.table.splice(index_o, 1);
            var json = JSON.stringify(obj);
            fs.writeFile("data.json", json, "utf8", function (err, data) {
                console.log("delete success");
            });
            res.send(obj.table);
        } else {
            res.sendStatus(500);
        }
    });
});
app.post("/api/db_update", function (req, res) {
    fs.readFile("data.json", "utf8", function (err, data) {
        var obj = JSON.parse(data);
        var index_o = null;
        obj.table.forEach(function (event, index) {
            if (JSON.stringify(event) == JSON.stringify(req.body[0])) {
                index_o = index;
            }
        });
        if (typeof index_o == "number") {
            obj.table.splice(index_o, 1, req.body[1]);
            var json = JSON.stringify(obj);
            fs.writeFile("data.json", json, "utf8", function (err, data) {
                console.log("update success");
            });
            res.send(obj.table);
        } else {
            res.sendStatus(500);
        }
    });

    console.log(req.body);
});
app.listen(80, () => {
    console.log("app listening on port 80.");
});
