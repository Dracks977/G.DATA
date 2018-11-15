const rp = require('request-promise');


function corplist (char, info, callback) {
	var x= info.length;
	console.log(x);
	for (var i = info.length - 1; i >= 0; i--) {
		var cid = info[i].corporation_id
		rp('https://esi.evetech.net/latest/corporations/'+cid+'/?datasource=tranquility').then(function (htmlString) {
			let c = JSON.parse(htmlString)
			corp = {
				id: cid,
				name: c.name,
				tax_rate: c.tax_rate,
				ticker: c.ticker,
				url: c.url,
				member_count: c.member_count,
				description: c.description,
				date_founded: c.date_founded,
				alliance: null
			}
			CORP.findOneAndUpdate({id: cid}, corp, {upsert: true, new: true}, function(err, cc) {
				char.corpHistory.push(cc._id);
				if(x == 1) {
					callback(char)
				}
				x--;
			})
		})
	}
}


module.exports =  {
	//recupere tout les info
	api: (id, callback) => {
		var info = new Object();
		info.id = id;
		rp('https://esi.evetech.net/latest/characters/'+id+'/?datasource=tranquility').then(function (htmlString) {
			info.basic = JSON.parse(htmlString)
			rp('https://esi.evetech.net/latest/characters/'+id+'/corporationhistory/?datasource=tranquility').then(function (htmlString) {
				info.corpHistory = JSON.parse(htmlString)
				rp('https://esi.evetech.net/latest/characters/'+id+'/portrait/?datasource=tranquility').then(function (htmlString) {
					info.img = JSON.parse(htmlString)
					rp('https://esi.evetech.net/latest/corporations/'+info.basic.corporation_id+'/?datasource=tranquility').then(function (htmlString) {
						info.corp = JSON.parse(htmlString)
						info.cid = info.basic.corporation_id;
						if (info.corp.alliance_id){
							rp('https://esi.evetech.net/latest/alliances/'+info.corp.alliance_id+'/?datasource=tranquility').then(function (htmlString) {
								info.alliance = JSON.parse(htmlString)
								callback(info);
							}).catch(function (err) {
								console.log(err)
							});
						} else {
							callback(info);
						}
					}).catch(function (err) {
						console.log(err)
					});
				}).catch(function (err) {
					console.log(err)
				});
			}).catch(function (err) {
				console.log(err)
			});
		}).catch(function (err) {
			console.log(err)
		});
	},
	// remplacer par mongodb
	charNode : (info, callback) => {
		let all;
		let corp;
		if(info.corp.alliance_id){
			all = {
				id: info.corp.alliance_id,
				name: info.alliance.name,
				ticker: info.alliance.ticker
			}
		}
		if (info.basic.corporation_id) {
			corp = {
				id: info.basic.corporation_id,
				name: info.corp.name,
				tax_rate: info.corp.tax_rate,
				ticker: info.corp.ticker,
				url: info.corp.url,
				member_count: info.corp.member_count,
				description: info.corp.description,
				date_founded: info.corp.date_founded,
				alliance: null
			}
		}
		let char = {
			id: info.id,
			name: info.basic.name,
			security_status: info.basic.security_status,
			description: info.basic.description,
			birthday: info.basic.birthday,
			img: info.img.px128x128,
			corpHistory: new Array()
		}

		if (info.corp.alliance_id){
			ALLIANCE.findOneAndUpdate({id: info.corp.alliance_id}, all, {upsert: true, new: true}, function(err, c) {
				corp.alliance = c._id;
				CORP.findOneAndUpdate({id: info.basic.corporation_id}, corp, {upsert: true, new: true}, function(err, cc) {
					char.corp = cc._id
					corplist(char, info.corpHistory, function(e){
						CHAR.findOneAndUpdate({id: info.id}, char, {upsert: true, new: true})
						.populate({path : 'corp', populate : {path : 'alliance'}})
						.exec(function(err, ccc) {
							callback(ccc);
						});
					})	
				});
			});
		} else if (info.basic.corporation_id) {
			CORP.findOneAndUpdate({id: info.basic.corporation_id}, corp, {upsert: true, new: true}, function(err, cc) {
				char.corp = cc._id
				corplist(char, info.corpHistory, function(e){
					CHAR.findOneAndUpdate({id: info.id}, char, {upsert: true, new: true})
					.populate({path : 'corp', populate : {path : 'alliance'}})
					.exec(function(err, ccc) {
						callback(ccc);
					});
				})	
			});
		} else {
			corplist(char, info.corpHistory, function(e){
				CHAR.findOneAndUpdate({id: info.id}, char, {upsert: true, new: true})
				.populate({path : 'corp', populate : {path : 'alliance'}})
				.exec(function(err, ccc) {
					callback(ccc);
				});
			})	
		}
		
	},
}
