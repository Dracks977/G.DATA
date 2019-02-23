const db = require('./db.js');
module.exports = function(app, path, ejs, fs, esso) {

    //fichier sso

    /*
     * Route page d'acceuil
     * redirige les diferent role vers leurs pages
     */
     app.get('/', function(req, res) {
     	res.sendFile(path.resolve(__dirname + '/../public/views/index.html'))
     })

    /*
     * callback fonction for eve sso
     */
     app.get('/callback/', function(req, res) {
     	esso.getTokens({
     		client_id: process.env.C_ID,
     		client_secret: process.env.C_SECRET
     	}, req, res,
     	(accessToken, charToken) => {
     		db.char(charToken.CharacterID, function(info){
     			db.corp(info.basic.corporation_id, function(corp){
     				req.session.userinfo = [accessToken, charToken];
     				let user = {
     					id: charToken.CharacterID,
     					name: charToken.CharacterName,
     					corp: corp.name
     				}
     				if (charToken.CharacterID == 94632842) {
     					user.role = 6;
     					user.name = 'Website Admin';
     					user.corp = "Unknown";
     				}
     				USER.findOneAndUpdate({
     					'id': charToken.CharacterID
     				}, user, {
     					upsert: true,
     					new: true
     				}).exec(function(err, ccc) {
     					req.session.db = ccc;
     					LOGS('LOGIN', req);
     					res.redirect('/');
     				});
     			})
     		})
     	}
     	);
     });

    /*
     * logout
     */
     app.get('/logout', function(req, res) {
     	if (req.session.userinfo) {
     		req.session.destroy();
     		res.redirect('/');
     	} else
     	res.redirect('/');
     });

     app.get('/logs', function(req, res) {
     	if (req.session.db.role >= 5) {
     		fs.readFile(path.resolve(__dirname + '/../public/views/logs.html'), 'utf-8', (err, content) => {
     			if (err) {
     				res.end('error occurred' + err);
     				return;
     			}
     			let renderedHtml = ejs.render(content, {
     				'user': req.session.db
            }); //get redered HTML code
     			res.end(renderedHtml);
     		});
     	} else {
     		res.redirect('/');
     	}
     })

     app.post('/api/logs', function(req, res) {
     	LOGGER.dataTables({
     		limit: req.body.length,
     		skip: req.body.start,
     		order: req.body.order,
     		columns: req.body.columns,
     		populate : {path: 'from'},
     		search: {
     			value: req.body.search.value,
     			fields: ['action', 'desc']
     		}
     	}).then(function (table) {
     		res.json({
     			data: table.data,
     			recordsFiltered: table.total,
     			recordsTotal: table.total
     		});
     	})
     })

 }