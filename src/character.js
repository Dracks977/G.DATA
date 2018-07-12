module.exports = function(app, path, ejs, fs, esso, cypher, rp){
	app.get('/character', function(req, res){
		var info = new Object();
		rp('https://esi.evetech.net/latest/characters/'+req.query.id+'/?datasource=tranquility').then(function (htmlString) {
			info.basic = JSON.parse(htmlString)
			rp('https://esi.evetech.net/latest/characters/'+req.query.id+'/corporationhistory/?datasource=tranquility').then(function (htmlString) {
				info.corpHistory = JSON.parse(htmlString)
				rp('https://esi.evetech.net/latest/characters/'+req.query.id+'/portrait/?datasource=tranquility').then(function (htmlString) {
					info.img = JSON.parse(htmlString)
					fs.readFile(path.resolve(__dirname + '/../public/views/character.html'), 'utf-8', function(err, content) {
						if (err) {
							res.end('error occurred' + err);
							return;
							//cree la node du perso alliance et corpo
						} 
   						let renderedHtml = ejs.render(content, {data: info});  //get redered HTML code
   						res.end(renderedHtml);
   					});
				}).catch(function (err) {

				});
			}).catch(function (err) {

			});
		}).catch(function (err) {

		});
	});
}