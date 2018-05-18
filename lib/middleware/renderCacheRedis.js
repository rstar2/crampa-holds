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

		const reqField = cache.createKeyFromRequest(req);
		const expireField = cache.createKey(reqField, 'expire');

		let expire = 0;
		res.cache = function (err, renderedStr) {
			// view-rendering engine failed
			if (err) return req.next(err);

			// TODO: store also the content type of the response if needed?
			// For now just assume all is plain HTML - so no need to set the response CONTENT-TYPE
			const cacheFields = [reqField, renderedStr];
			if (expire > 0) {
				// create a expire field (xxxxx:expire)
				cacheFields.push(expireField, Date.now() + expire * 1000);
			}
			// set multiple fields at once  - the real response and the expire time (this is because REDIS doesn't have expire on fields natively)
			cache.hmset(hashKeyRender, cacheFields, function (err) {
				if (err) debug(`Failed to cache response for request ${req} with key ${reqField}`);
				else debug(`Cached response for request ${req} with key ${reqField} with expire - ${expire > 0 ? expire : 'never'}`);

				// always send the response even if caching failed
				res.send(renderedStr);
			});
		};
		// allow the expiration to be augmented
		res.cacheExpire = function (secs) {
			expire = secs;
			return res.cache;
		};


		cache.getRenderKey(reqField, function (err, value) {
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
