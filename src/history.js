module.exports = function(type, req, other) {
	if (req.session.db.role < 5) {
		var role = ["Waiting", "Public", "Private", "Secret", "Top secret", "Extremely Secret", "IT Developer"]
		let obj = {from:req.session.db._id}
		obj.action = type;
		switch (type) {
			case 'LOGIN':
			obj.desc = req.session.db.name + ' log in 3er with : ' + req.ip;
			break;
			case 'VIEWCHAR':
			obj.desc = req.session.db.name +' view character : ' + other.db.name + '(' + other.db.id + ')';
			break;
			case 'VIEWTAG':
			obj.desc = req.session.db.name +' search tag : ' + other;
			break;
			case 'VIEWMEMBERS':
			obj.desc = req.session.db.name +' view members panel ';
			break;
			case 'ADDTAG':
			obj.desc = req.session.db.name +' add tag : ' + req.body.name + ' on ' + other.name;
			break;
			case 'ADDINTEL':
			obj.desc = req.session.db.name +' add intel : ' + req.body.action + ' on ' + other.name;
			break;
			case 'RMINTEL':
			obj.desc = req.session.db.name +' remove intel : ' + other.intel.action + ' on ' + other.user.name;
			break;
			case 'RMTAG':
			obj.desc = req.session.db.name +' remove tag : ' + other.tag.name + ' on ' + other.user.name;
			break;
			case 'ADDLINK':
			obj.desc = req.session.db.name +' add new character : ' + other.new.db.name + ' (' + other.new.db.id + ')' + ' on ' + other.old.name + ' (' + other.old.id + ')';
			break;
			case 'CHANGEROLE':
			obj.desc = req.session.db.name +' change role of ' + other.name + ' for ' + role[req.body.role];
			break;
			default:
			obj.desc = 'uknow log'

		}
		let log = new LOGGER(obj)
		log.save();
	}
}