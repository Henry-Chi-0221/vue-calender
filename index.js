const express = require('express') 
const path = require('path') 
const app = express()
var bodyParser = require('body-parser');
var history = require('connect-history-api-fallback');
var fs = require('fs');
var data = [];
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes

var user = 'm951406@gmail.com';
var password = '1234';
app.use(history());
app.use(express.static(path.join(__dirname, 'dist'))) ;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/loginCheck',function(req ,res){
    if(req.body.username == user &&
       req.body.password == password){
        res.sendStatus(200);
        console.log('login success');
    }
    else{
        res.sendStatus(500);
        console.log('access denied');
    }
})
app.post('/db_add',function(req,res){
    fs.readFile('data.json','utf8',function(err ,data){
        var obj = JSON.parse(data);
        obj.table.push(req.body);
        var json = JSON.stringify(obj);
        fs.writeFile('data.json', json, 'utf8',function(err,data){
            console.log('add success');
        });
        res.send(obj.table);
        //console.log(data);
    })
})

app.post('/db_select',function(req,res){
    fs.readFile('data.json','utf8',function(err ,data){
        var obj = JSON.parse(data);
        res.send(obj.table);
    })
})
app.post('/db_delete',function(req,res){
    fs.readFile('data.json','utf8',function(err ,data){
        var obj = JSON.parse(data);
        var index_o = null;
        obj.table.forEach(function(event,index){
            if(JSON.stringify(event) == JSON.stringify(req.body)){
                index_o = index;
            }
        })
        if(typeof index_o == 'number'){
            obj.table.splice(index_o , 1);
            var json = JSON.stringify(obj);
            fs.writeFile('data.json', json, 'utf8',function(err,data){
                console.log('delete success');
            });
          res.send(obj.table);
        }else{
            res.sendStatus(500);
        }
        
    })  
})
app.post('/db_update',function(req,res){
    
    fs.readFile('data.json','utf8',function(err ,data){
        var obj = JSON.parse(data);
        var index_o = null;
        obj.table.forEach(function(event,index){
            if(JSON.stringify(event) == JSON.stringify(req.body[0])){
                index_o = index;
            }
        })
        if(typeof index_o == 'number'){
            obj.table.splice(index_o , 1 , req.body[1]);
            var json = JSON.stringify(obj);
            fs.writeFile('data.json', json, 'utf8',function(err,data){
                console.log('update success');
            });
          res.send(obj.table);
        }else{
            res.sendStatus(500);
        }
        
    })
    
    console.log(req.body);
})
app.listen(80,() => { 
console.log('app listening on port 80.') 
}) 