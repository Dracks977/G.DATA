module.exports = function(app, path, ejs, fs, esso){

	//fichier sso

	/*
	* Route page d'acceuil
	* redirige les diferent role vers leurs pages
	*/
	app.get('/', function(req, res){
		res.sendFile(path.resolve(__dirname + '/../public/views/index.html'))
	})
	
	/*
	* callback fonction for eve sso
	*/
	app.get('/callback/', function(req, res){
		esso.getTokens({
			client_id: process.env.C_ID,
			client_secret: process.env.C_SECRET
		}, req, res, 
		(accessToken, charToken) => {
			req.session.userinfo = [accessToken, charToken];
			let user = {
				id: charToken.CharacterID,
				name: charToken.CharacterName
			}
			// a enlever quand j'aurais la gestion des droits
			if (charToken.CharacterID == 94632842){
				user.role = 6
				user.name = 'Website Admin'
			}
			USER.findOneAndUpdate({'id': charToken.CharacterID}, user, {upsert: true, new: true}).exec(function(err, ccc) {
				req.session.db = ccc;
				res.redirect('/');
			});
		}
		);
	});

	/*
	* logout
	*/
	app.get('/logout', function(req, res){
		if (req.session.userinfo){
			req.session.destroy();
			res.redirect('/');
		}
		else
			res.redirect('/');
	});

	
}