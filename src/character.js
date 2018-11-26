const db = require('./db.js');
module.exports = function(app, path, ejs, fs){

	// ici une page templater qui get les info de corp history
	// ici la route a template
	app.get('/character', function(req, res){
		db.char(req.query.id, function(info){
			db.charput(info, function(result){
				res.json(result)
			})
		})
	});

	// ici les route pour les appelle ajax
	app.get('/api/img/:id', function(req, res){
		db.img(req.params.id, function(result){
			res.json(result)
		})
	});

	app.get('/api/corp/:id', function(req, res){
		db.corp(req.params.id, function(result){
			res.json(result)
		})
	});

	app.get('/api/alliance/:id', function(req, res){
		db.alliance(req.params.id, function(result){
			res.json(result)
		})
	});
}