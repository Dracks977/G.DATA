/*=====================Initialisation=====================*/
const express = require("express");
const app  = express();
const http = require('http').Server(app);
const httpd	= require('https');
const fs = require('fs');
const bodyParser = require('body-parser')
const ejs = require('ejs');
const path = require('path');
const session = require('express-session');
const esso = require('eve-sso-simple');
var cypher = require('cypher-stream')('bolt://localhost', 'GOTG', 'GOTG');
const rp = require('request-promise');
/*======================================================*/

// Middleware session
app.engine('html', require('ejs').renderFile);

app.use(session(
{
	secret: 'eenvdeo',
	saveUninitialized: false,
	resave: false
}
));

app.use(bodyParser.json());       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 

/*======================routes==========================*/ 

	/*------include fichier------*/
	require('./src/main.js')(app, path, ejs, fs, esso, cypher);
	require('./src/character.js')(app, path, ejs, fs, esso, cypher, rp);


/*======================route fichier static (public)====================*/
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/img", express.static(__dirname + '/public/img'));
app.use("/js", express.static(__dirname + '/public/js'));


/*==================start serv==================*/
http.listen(80, function(){
	console.log('listening on *:80');
});