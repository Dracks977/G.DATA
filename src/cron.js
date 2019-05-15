const RateLimiter = require("limiter").RateLimiter;
const limiter = new RateLimiter(40, "second");
const schedule = require('node-schedule');
const db = require('./db.js');

module.exports = function() {
	let j = schedule.scheduleJob('0 */6 * * *', function(){
		USER.find({}, (err, res) => {
			for (var i = res.length - 1; i >= 0; i--) {
				let id = res[i].id;
				limiter.removeTokens(1, (err, remainingRequests) => {
					db.updateUser(id, (data) => {
						console.log('done!');
					})
				})
			}
		})
	});
	console.log(j.nextInvocation());
}