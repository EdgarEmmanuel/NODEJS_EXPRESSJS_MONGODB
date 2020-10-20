var express = require("express");
var bodyParser = require('body-parser')
var app = express();

app.set("view engine","ejs");
app.set("assets",express.static("/css/"));

var urlencodedParser = bodyParser.urlencoded({ extended: false });

require("./controllers/route")(app,urlencodedParser);

app.listen(3000,()=>{console.log("port listening on port 3000")});