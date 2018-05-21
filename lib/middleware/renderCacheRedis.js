const { noop } = require('lodash');
const debug = require('debug')('app:routes:cache');


module.exports = function (keystone) {
	const cache = keystone.cache;

	// return empty function if no cache at all
	if (!cache) return noop;

	return function (req, res, next) {
		// only GET requests could be cached
		if (req.method !== 'GET') return next();

		// check if the redis-client is still connected, e.g. test when Redis is closed/failed
		if (!cache.isConnected()) {
			res.cache = undefined;
			res.cacheExpire = noop; // noop return 'undefined'
			return next();
		}

		const reqField = cache.render.createKey(req);

		let expire = -1;
		res.cache = function (err, renderedStr) {
			// view-rendering engine failed
			if (err) return req.next(err);

			cache.render.set(reqField, renderedStr, expire);
			// always send the response even if caching failed
			res.send(renderedStr);
		};
		// allow the expiration to be augmented
		res.cacheExpire = function (secs) {
			expire = secs;
			return res.cache;
		};


		// check if the request has is cached
		cache.render.get(reqField, function (err, value) {
			if (err) {
				// throw err;

				// no need to throw error - act as if key is not cached
				return next();
			}

			if (value != null) {
				debug(`Used cached response for request ${req}`);
				return res.send(value);
			}

			// response is not cached
			next();
		});
	};
};
