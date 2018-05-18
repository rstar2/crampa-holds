
const { noop } = require('lodash');

// const hash = require('object-hash');

const debug = require('debug')('app:routes:cache');

const { createKey } = require('../cache');

/**
 * Build a valid cache key from this request
 * @param {Request} req Express request instance
 */
function createFieldFromRequest (req) {
	let key = req.path;

	let query = '';  // NOTE - "" is valid key/field in REDIS
	const queryKeys = Object.keys(req.query);
	if (queryKeys.length) {
		// 1. Simple plain (more readable) queryKeys
		query = queryKeys.sort().reduce((acc, q) => {
			return acc + q + '=' + req.query[q] + ';';
		}, '');

		// 2. or Hash the queryKeys
		// query = ':' + hash(req.query);
	}
	return createKey(key, query);
}

module.exports = function (keystone) {
	const cache = keystone.cache;

	// return empty function if no cache at all
	if (!cache) return noop;

	let connected = true;
	cache.on('error', (event) => {
		debug(`Cache server failed on (re)connecting or executing a command.`);
	});
	cache.on('end', () => {
		debug(`Cache server is disconnected`);
		connected = false;
	});
	cache.on('connect', () => {
		debug(`Cache server is (re)connected`);
		connected = true;
	});


	return function (req, res, next) {
		// only GET requests could be cached
		if (req.method !== 'GET') return next();

		// check if the redis-client is still connected, e.g. test when Redis is closed/failed
		if (!connected) {
			res.cache = undefined;
			res.cacheExpire = noop; // noop return 'undefined'
			return next();
		}

		const reqField = createFieldFromRequest(req);
		const expireField = createKey(reqField, 'expire');

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


		cache.hmget(hashKeyRender, [reqField, expireField], function (err, values) {
			if (err) {
				// throw err;

				// no need to throw error - act as if key is not cached
				return next();
			}

			// 'values' will be valid array always (even if the values inside are not)

			if (values[0] != null) {

				// check if expiration is set and response is still not expired
				if (values[1] && values[1] < Date.now()) {
					debug(`Cached response for request ${req} has expired`);
					cache.hdel(hashKeyRender, [reqField, expireField]);
					return next();
				}

				// response is cached - use it
				debug(`Used cached response for request ${req}`);
				return res.send(values[0]);
			}


			// response is not cached
			next();
		});
	};
};
