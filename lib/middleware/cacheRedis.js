
const { noop } = require('lodash');
// const hash = require('object-hash');

const debug = require('debug')('app:routes:cache');


/**
 * TODO: 
 * Build a valid cache key from this request
 * @param {Request} req
 */
function buildCacheKey (req) {
	let key = req.path;

	// hash the queries
	const queryKeys = Object.keys(req.query);
	if (queryKeys.length) {
		key += ':';
		queryKeys.sort().forEach(q => {
			key += q + '=' + req.query[q] + ';';
		});
		// key += ':' + hash(req.query);
	}
	return key;
}

module.exports = function (keystone) {
	const cache = keystone.cache;

	// return empty function if no cache
	if (!cache) return noop;

	return function (req, res, next) {
		// only GET requests could be cached
		if (req.method !== 'GET') {
			return next();
		}

		const cacheKey = buildCacheKey(req);

		res.cache = function (err, response) {
			if (err) {
				res.send(response);
				return;
			}

			cache.set(cacheKey, response, function (err) {
				if (err) debug(`Failed to cache response for request ${req} with key ${cacheKey}`);
				else debug(`Cached response for request ${req} with key ${cacheKey}`);

				// always send the response even if caching failed
				res.send(response);
			});
		};

		cache.get(cacheKey, function (err, response) {
			if (err) {
				// throw err;
				next();
			}

			if (response != null) {
				debug(`Used cached response for request ${req}`);

				// response is cached - use it
				res.send(response);
			} else {
				// response is not cached
				next();
			}
		});
	};
};
