module.exports = function (keystone) {
	if (process.env.REDIS === 'true') {
		const redis = require('redis');
		keystone.cache = require('../cache')(redis.createClient(process.env.REDIS_PORT));
	}
};
