const rp = require('request-promise');


function corp(info, cypher, data, callback) {




	if (!info.corp.date_founded)
		info.corp.date_founded = ''
	if (!info.corp.url)
		info.corp.url = ''
	var c = {
		i: info.cid,
		n: info.corp.name.replace(/"/g, "\\\""),
		t: info.corp.tax_rate,
		d: info.corp.description.replace(/"/g, "\\\""),
		df: info.corp.date_founded.replace(/"/g, "\\\""),
		tg : info.corp.ticker.replace(/"/g, "\\\""),
		url : info.corp.url.replace(/"/g, "\\\"")
	}
	

}

module.exports =  {
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
	charNode : (info, cypher, callback) => {
		var n = {
			i: info.id.replace(/"/g, "\\\""),
			n: info.basic.name.replace(/"/g, "\\\""),
			d: info.basic.description
			.replace(/\\/g, "\\\\")
			.replace(/\$/g, "\\$")
			.replace(/'/g, "\\'")
			.replace(/"/g, "\\\""),
			s: info.basic.security_status,
			b: info.basic.birthday.replace(/"/g, "\\\"")
		};
		if (!info.corp.date_founded)
			info.corp.date_founded = ''
		if (!info.corp.url)
			info.corp.url = ''
		// node ceo et node creator et node alliance
		var c = {
			i: info.cid,
			n: info.corp.name.replace(/"/g, "\\\""),
			t: info.corp.tax_rate,
			d: info.corp.description
			.replace(/\\/g, "\\\\")
			.replace(/\$/g, "\\$")
			.replace(/'/g, "\\'")
			.replace(/"/g, "\\\""),
			df: info.corp.date_founded.replace(/"/g, "\\\""),
			tg : info.corp.ticker.replace(/"/g, "\\\""),
			url : info.corp.url.replace(/"/g, "\\\"")
		}
		var cyp;
		if (info.alliance) {
			var a = {
				i: info.corp.alliance_id,
				df: info.alliance.date_founded.replace(/"/g, "\\\""),
				n: info.alliance.name.replace(/"/g, "\\\""),
				tg : info.alliance.ticker.replace(/"/g, "\\\"")
			}
			cyp = 'MERGE (n:character {id: "'+n.i+'", name: "'+n.n+'", desc: "'+n.d+'", ss: "'+n.s+'", birthday: "'+n.b+'"}) MERGE (c:corp {id: "'+c.i+'", name: "'+c.n+'", desc: "'+c.d+'", tax_rate: "'+c.t+'", date_founded: "'+c.df+'", ticker: "'+c.tg+'", url: "'+c.url+'"}) MERGE (n)-[r:Be_Part_Of  {name: "Be_Part_Of", old: "false"}]->(c) MERGE (a:alliance {id: "'+a.i+'", name: "'+a.n+'", date_founded: "'+a.df+'", ticker: "'+a.tg+'"}) MERGE (c)-[r2:Be_Part_Of  {name: "Be_Part_Of", old: "false"}]->(a) return n, c, a';
		} else {
			cyp = 'MERGE (n:character {id: "'+n.i+'", name: "'+n.n+'", desc: "'+n.d+'", ss: "'+n.s+'", birthday: "'+n.b+'"}) MERGE (c:corp {id: "'+c.i+'", name: "'+c.n+'", desc: "'+c.d+'", tax_rate: "'+c.t+'", date_founded: "'+c.df+'", ticker: "'+c.tg+'", url: "'+c.url+'"}) MERGE (n)-[r:Be_Part_Of  {name: "Be_Part_Of", old: "false"}]->(c) return n, c';
		}
		var test = [];
		cypher(cyp)
		.on('data', function (result){
			test.push(result);
		})
		.on('end', function() {
			callback(test);
		});
	},
}
