module.exports = (mongoose) => {
	let Schema = mongoose.Schema;

	//character
	let Char = new Schema({
		id: Number,
		name: String,
		security_status: Number,
		description: String,
		birthday: Date,
		img: String,
		corp: {type: Schema.Types.ObjectId, ref: 'Corp'},
		corpHistory: [{ type: Schema.Types.ObjectId, ref: 'Corp' }],
		created : { type: Date },
		updated : { type: Date },
	});
	
	Char.pre('save', function(next){
		now = new Date();
		this.updated = now;
		if ( !this.created ) {
			this.created = now;
		}
		next();
	});

	//corp
	let Corp = new Schema({
		id: Number,
		name: String,
		tax_rate: Number,
		ticker: String,
		url: String,
		member_count: Number,
		description: String,
		date_founded: Date,
		alliance: { type: Schema.Types.ObjectId, ref: 'Alliance' },
		created : { type: Date },
		updated : { type: Date },
	});

	Corp.pre('save', function(next){
		now = new Date();
		this.updated = now;
		if ( !this.created ) {
			this.created = now;
		}
		next();
	});

	//alliance
	let Alliance = new Schema({
		id: Number,
		name: String,
		ticker: String,
		created : { type: Date },
		updated : { type: Date },
	});

	Alliance.pre('save', function(next){
		now = new Date();
		this.updated = now;
		if ( !this.created ) {
			this.created = now;
		}
		next();
	});

	//global

	CHAR = mongoose.model('Char', Char);
	CORP = mongoose.model('Corp', Corp);
	ALLIANCE = mongoose.model('Alliance', Alliance);
}