const db = require('./db.js');
module.exports = function(app, path, ejs, fs, esso){
	// ici une page templater qui get les info de corp history
	app.get('/character', function(req, res){
			db.char(req.query.id, function(info){
					db.charput(info, function(result){
								res.json(result)
					})
			})
	});
}