const db = require('./db.js');
module.exports = function(app, path, ejs, fs, esso, cypher){
	app.get('/character', function(req, res){
			db.api(req.query.id, function(info){
					db.charNode(info, cypher, function(result){
						
								res.json(result)
					})
			})
	});
}