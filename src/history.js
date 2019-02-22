module.exports = function(type, req, other) {
	let obj = {from:req.session.db._id}
	obj.action = type;
	switch (type) {
		case 'LOGIN':
		obj.desc = req.session.db.name + ' log in 3er with : ' + req.headers['x-forwarded-for'].split(',')[0];
		break;
		case 'VIEWCHAR':
		obj.desc = req.session.db.name +' view character : ' + other.db.name + '(' + other.db.id + ')';
		break;
		case 'VIEWMEMBERS':
		obj.desc = req.session.db.name +' view members panel ';
		break;
		case 'ADDTAG':
		obj.desc = req.session.db.name +' add tag : ' + req.body.name + ' on : ' + other.name;
		break;
		case 'ADDINTEL':
		obj.desc = req.session.db.name +' add intel : ' + req.body.action + ' on : ' + other.name;
		break;
		case 'RMINTEL':
		obj.desc = req.session.db.name +' remove intel : ' + other.intel.action + ' on : ' + other.user.name;
		break;
		case 'RMTAG':
		obj.desc = req.session.db.name +' remove tag : ' + other.tag.name + ' on : ' + other.user.name;
		break;
		default:
		obj.desc = 'uknow log'

	}
	let log = new LOGGER(obj)
	log.save();
}