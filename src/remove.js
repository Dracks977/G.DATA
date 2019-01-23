module.exports = function(app, path, ejs, fs){
	app.post('/api/tags/rm', function(req, res){
		if (req.body._id && req.body.cid) {
			let tags = {_id : req.body._id};
			console.log(tags)
			CHAR.findById(req.body.cid).exec((err, doc) => {
				if (err)
					res.send(err);
				let save = doc.tags.id(req.body._id)
				if (save.visibility < req.session.db.role || req.session.db.role >= 5){
					save.remove()	
					doc.save((err,result) => {
						if (err){
							res.sendStatus(500);
							console.log(err)
						}
						else
							res.sendStatus(200);
					})
				} else {
					res.sendStatus(401);
				}
			})
		} else {
			res.sendStatus(404);
		}
	});
}