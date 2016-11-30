//Conexão com o banco
var pg = require("pg");
var conString = "postgres://postgres:@localhost:5432/teewa";
var client = new pg.Client(conString);
client.connect();

//Consultas
var JsonUsers;
var sqlUsers = "select \"user\".id, \"user\".name as nomeUser, \"user\".mobile , \"store\".name" 
    sqlUsers += " from \"user\""
    sqlUsers += " inner join \"seller\" on \"user\".id = \"seller\".id"
    sqlUsers += " inner join \"store\" on \"store\".id = \"seller\".idstore;"
var query = client.query(sqlUsers);

query.on("row", function (row, result) {
    result.addRow(row);
});
query.on("end", function (result) {
    JsonUsers = JSON.stringify(result.rows, null, "    ");
    console.log(JsonUsers);
});


//Criando Roteador
var router = require('./router');

var app = router(3412);
app.interceptor(function (req, res, next) {//
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.interceptor(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json;charset=UTF-8');
    next();
});

//Criando Rotas
app.get('/vendedores', function (req, res) {
    res.write(JsonUsers);
    res.end();
});

app.post('/vendedores', function (req, res) {
    var vendedor = req.body;
    contatos.push(JSON.parse(vendedor));
    res.end();
});
