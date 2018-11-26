module.exports = function(app, path, ejs, fs){
	app.get('/test', function(req, res){
		res.sendFile(path.resolve(__dirname + '/../public/views/character.html'))
	})
}