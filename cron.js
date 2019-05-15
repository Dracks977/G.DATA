
const RateLimiter = require("limiter").RateLimiter;
const db = require('./src/db.js');
require('dotenv').config();
const limiter = new RateLimiter(40, "second");
const schedule = require('node-schedule');
const mongoose = require('mongoose');
const url = 'mongodb://'+ process.env.DB_HOST +':'+ process.env.DB_PORT +'/' + process.env.DB_NAME;


mongoose.connect(url, { useNewUrlParser: true });
let mong = mongoose.connection;
mong.on('error', function(err){
	process.exit(1)
});
mong.once('open', function() {
	console.log('Connected')
});

require('./models/model.js')(mongoose);
updateUser();
let j = schedule.scheduleJob('0 */4 * * *', function(){
	updateUser();
});


function updateUser() {
	console.log('NEW JOB -> Members data update');
	USER.find({}, (err, res) => {
		for (var i = res.length - 1; i >= 0; i--) {
			let id = res[i].id;
			limiter.removeTokens(1, (err, remainingRequests) => {
				db.updateUser(id, (data) => {
				})
			})
		}
	})
}
