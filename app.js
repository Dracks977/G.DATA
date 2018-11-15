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
/*======================================================*/

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/GData');
let db = mongoose.connection;
db.on('error', function(err){
  process.exit(1)
});
db.once('open', function() {
  console.log('Connected')
});

//define model
require('./models/model.js')(mongoose);

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
	require('./src/main.js')(app, path, ejs, fs, esso);
	require('./src/character.js')(app, path, ejs, fs, esso);


/*======================route fichier static (public)====================*/
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/img", express.static(__dirname + '/public/img'));
app.use("/js", express.static(__dirname + '/public/js'));


/*==================start serv==================*/
http.listen(8080, function(){
	console.log('listening on *:8080');
});