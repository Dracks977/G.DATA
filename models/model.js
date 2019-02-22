module.exports = (mongoose) => {
	let Schema = mongoose.Schema;
	let dataTables = require('mongoose-datatables')
	//character eve a afficher
	let Char = new Schema({
		id: Number,
		name: String,
		intels: [{ type: Schema.Types.ObjectId, ref: 'Intels' }],
		tags: [{name: String, from: { type: Schema.Types.ObjectId, ref: 'User'}, visibility: { type: Number, default: 1 }}],
		alts: { type: Schema.Types.ObjectId, ref: 'Alt',  default: null},
		created: { type: Date },
		updated: { type: Date },
	});

	Char.pre('save', function(next){
		now = new Date();
		this.updated = now;
		if ( !this.created ) {
			this.created = now;
		}
		next();
	});


	// user pour la gestion des droit sur le site != charactere
	let User = new Schema({
		id: Number,
		name: String,
		corp: String,
		role: { type: Number, default: 0 },
		created: { type: Date },
		updated: { type: Date },
	});
	
	User.pre('save', function(next){
		now = new Date();
		this.updated = now;
		if ( !this.created ) {
			this.created = now;
		}
		next();
	});

	User.plugin(dataTables, {
		formatters: {
			toPublic : function (info) {
				var role = ["Waiting", "Public", "Private", "Secret", "Top secret", "Extremely Secret", "IT Developer"]
				return {
					name: info.name,
					corp: info.corp ? info.corp : 'update on next connection...',
					role: role[info.role],
					_id: info._id
				}
			}
		}
	})

	// ajouter la visibility
	let Alt = new Schema({
		alts: [{ type: Schema.Types.ObjectId, ref: 'Char'}],
		created: { type: Date },
		updated: { type: Date },
	});
	
	Alt.pre('save', function(next){
		now = new Date();
		this.updated = now;
		if ( !this.created ) {
			this.created = now;
		}
		next();
	});

	//intels (message en gros sur le joueur)
	let Intels = new Schema({
		links: [String],
		comment: String,
		action: String,
		from: {id: { type: Schema.Types.ObjectId, ref: 'User'}, name: String},
		visibility: { type: Number, default: 1 },
		type: String,
		date: Date,
		created : { type: Date },
		updated : { type: Date },
	});

	Intels.pre('save', function(next){
		now = new Date();
		this.updated = now;
		if ( !this.created ) {
			this.created = now;
		}
		next();
	});

	let Logs = new Schema({
		from: { type: Schema.Types.ObjectId, ref: 'User'}, // utilisateur
		action: String, // nom de laction connection/ajout tag/link char (pour trier plus simplement)
		desc: String, // une chaine de caratere résument l'action
		created : { type: Date }, // l'heure
		updated : { type: Date },
	});

	Logs.pre('save', function(next){
		now = new Date();
		this.updated = now;
		if ( !this.created ) {
			this.created = now;
		}
		next();
	});


	//global

	CHAR = mongoose.model('Char', Char);
	ALT = mongoose.model('Alt', Alt);
	LOGGER = mongoose.model('Logs', Logs);
	USER = mongoose.model('User', User);
	INTELS = mongoose.model('Intels', Intels);
}