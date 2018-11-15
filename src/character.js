const db = require('./db.js');
module.exports = function(app, path, ejs, fs, esso){
	app.get('/character', function(req, res){
			db.api(req.query.id, function(info){
					db.charNode(info, function(result){
								res.json(result)
					})
			})
	});
}