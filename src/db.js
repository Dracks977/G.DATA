const rp = require('request-promise');
// fichier appelle en api
module.exports =  {
	//recupere tout les info
	char: (id, callback) => {
		var info = new Object();
		info.id = id;
		rp('https://esi.evetech.net/latest/characters/'+id+'/?datasource=tranquility').then(function (htmlString) {
			info.basic = JSON.parse(htmlString)
			callback(info);
		}).catch(function (err) {
			console.log(err)
		});
	},
	// on enregistre l'user ^pour les tag etc
	charput : (info, callback) => {
		let char = {
			id: info.id,
			name: info.basic.name,
		}
		CHAR.findOneAndUpdate({id: info.id}, char, {upsert: true, new: true})
		.populate({path : 'intels'})
		.populate({path : 'alts'})
		.exec((err, ccc) => {
			callback({'db' : ccc, 'basic': info.basic});
		});		
	},
	img : (id, callback) => {
		rp('https://esi.evetech.net/latest/characters/'+id+'/portrait/?datasource=tranquility').then(function (htmlString) {
			callback(JSON.parse(htmlString))
		}).catch(function (err) {
			callback(err)
		});
	},
	corp : (id, callback) => {
		rp('https://esi.evetech.net/latest/corporations/'+id+'/?datasource=tranquility').then(function (htmlString) {
			callback(JSON.parse(htmlString))
		}).catch(function (err) {
			callback(err)
		});
	},
	alliance : (id, callback) => {
		rp('https://esi.evetech.net/latest/alliances/'+id+'/?datasource=tranquility').then(function (htmlString) {
			callback(JSON.parse(htmlString))
		}).catch(function (err) {
			callback(err)
		});
	}
}