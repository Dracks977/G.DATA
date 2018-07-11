module.exports = function(app, path, ejs, fs, esso, cypher){
	app.get('/', function(req, res){
		res.sendFile(path.resolve(__dirname + '/../public/views/index.html'))
	});
}