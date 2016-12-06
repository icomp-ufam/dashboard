//Conexão com o banco
var pg = require("pg");
var conString = "postgres://postgres:@localhost:5432/teewa";
var client = new pg.Client(conString);
client.connect();

//Consultas
var sqlSellers = "select \"user\".id, \"user\".name as nomeUser, \"user\".mobile , \"store\".name" 
    sqlSellers += " from \"user\""
    sqlSellers += " inner join \"seller\" on \"user\".id = \"seller\".id"
    sqlSellers += " inner join \"store\" on \"store\".id = \"seller\".idstore;"

var sqlUsers = "select \"user\".name from \"user\" where \"user\".id NOT IN (select \"seller\".id from \"seller\") order by \"user\".id"

function queryAngular(sql) {
    var retorno;
    var queryA = client.query(sql);
    queryA.on("row", function (row, result) {
        result.addRow(row);
    });
    queryA.on("end", function (result) {
        retorno = JSON.stringify(result.rows, null, "    ");
        console.log(retorno);
    });
    return retorno;
}
var JsonUsers = queryAngular(sqlUsers);
var JsonSellers = queryAngular(sqlSellers);

//Criandoa Roteador
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
    res.write(JsonSellers);
    res.end();
});

app.post('/vendedores', function (req, res) {
    var vendedor = req.body;
    contatos.push(JSON.parse(vendedor));
    res.end();
});

app.get('/clientes', function (req, res) {
    res.write(JsonUsers);
    res.end();
});