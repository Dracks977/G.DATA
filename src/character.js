module.exports = function(app, path, ejs, fs, esso, cypher, rp){
	app.get('/character', function(req, res){
		console.log(req.query.id)
		rp('https://esi.evetech.net/latest/characters/'+req.query.id+'/?datasource=tranquility').then(function (htmlString) {
        		console.log(htmlString)
        	}).catch(function (err) {
       		 // Crawling failed...
       		});
        });
}