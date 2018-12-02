const db = require('./db.js');
module.exports = function(app, path, ejs, fs){

	// ici une page templater qui get les info de corp history
	// ici la route a template
	app.get('/character', function(req, res){
		db.char(req.query.id, (info) =>{
			db.charput(info, (result) =>{
				console.log(result)
				fs.readFile(path.resolve(__dirname + '/../public/views/character.html'), 'utf-8', (err, content) => {
					if (err) {
						res.end('error occurred' + err);
						return;
					} 
					console.log("=========")
					console.log(req.session.db)
   						let renderedHtml = ejs.render(content, {'user' : req.session.db, 'char' : result});  //get redered HTML code
   						res.end(renderedHtml);
   					});
			})
		})
	});

	app.get('/api/corp/:id', function(req, res){
		db.corp(req.params.id, function(result){
			res.json(result)
		})
	});

	app.get('/api/char/corpname/:id', function(req, res){
		db.char(req.params.id, function(result){
			db.corp(result.basic.corporation_id, function(result2){
			res.json(result2.name)
			})
		})
	});

	app.get('/api/alliance/:id', function(req, res){
		db.alliance(req.params.id, function(result){
			res.json(result)
		})
	});

	app.post('/api/alts/link', function(req, res) {
		if (req.body.alt && req.body.main) {
			db.char(req.body.alt, function(info) {
				db.charput(info,(result) => {
					//result = le new perso
					CHAR.findById(req.body.main).populate({path : 'alts'}).exec((err, doc) =>{
						if (err) {
							res.status(500).send(err)
							return
						}
						if (result.db.alts != null) {
							res.status(301).send('Already on alts group');
						} else if (result.db.alts == null && doc.alts == null){
							const alts = new ALT();
							alts.alts.push(doc)
							alts.alts.push(result.db)
							alts.save().then(() => {
								result.db.alts = alts;
								result.db.save().then(() => {
									doc.alts = alts;
									doc.save().then(() => {
										res.status(200).send('No alts for 2 people');
									});
								})
							});
						} else if (result.db.alts == null && doc.alts != null) {
							doc.alts.alts.push(result.db)
							doc.alts.save().then(() => {
								result.db.alts = doc.alts
								result.db.save()
								res.status(200).send('Add an alts');
							})
						} else {
							res.status(500).send('What the fuck');
						}
					});
				})
			})
		} else {
			res.status(500).send('What the fuck');
		}
	});

	app.post('/api/tags/add', function(req, res){
		console.log(req.body)
		if (req.body.id && req.body.name && req.body.visibility && req.body._id) {
			let tags = {from : req.body._id, name: req.body.name, visibility: req.body.visibility};
			CHAR.findById(req.body.id).exec((err, doc) => {
				console.log(doc)
				if (err)
					res.send(err);
				doc.tags.push(tags)
				doc.save((err,result) => {
					if (err)
						res.send(err);
					res.sendStatus(200);
				})
			})
		} else {
			res.sendStatus(404);
		}
	});

}