// const hash = require('object-hash');
const { noop } = require('lodash');
const debug = require('debug')('app:cache');
const appName = process.env.REDIS_APP_NAME || 'app';

const createKey = (...args) => {
	return args.join(':');
};
const hashKeyRender = createKey(appName, 'render');


/**
 * Build a valid cache key from this request
 * @param {Request} req Express request instance
 */
const createKeyFromRequest = (req) => {
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

const getRenderKey = (client, reqField, callback = noop) => {
	const expireField = createKey(reqField, 'expire');

	client.hmget(hashKeyRender, [reqField, expireField], function (err, values) {
		if (err) {
			return callback(err);
		}

		// 'values' will be valid array always (even if the values inside are not)

		if (values[0] != null) {
			// check if expiration is set and response is still not expired
			if (values[1] && values[1] < Date.now()) {
				debug(`Cached response for ${reqField} has expired`);
				client.hdel(hashKeyRender, [reqField, expireField]);
			} else {
				// response is cached - use it
				debug(`Valid cached response for request ${reqField}`);
				callback(null, values[0]);
			}

		}

		// response is not cached
		callback(null, null);
	});

};

const setRenderKey = (client, key, expire = -1) => {
	// set multiple fields at once  - the real response and the expire time (this is because REDIS doesn't have expire on fields natively)
	client.hmset(hashKeyRender, cacheFields, function (err) {
		if (err) debug(`Failed to cache response for request ${req} with key ${reqField}`);
		else debug(`Cached response for request ${req} with key ${reqField} with expire - ${expire > 0 ? expire : 'never'}`);

		// always send the response even if caching failed
		res.send(renderedStr);
	});
};


/**
 * @param {RedisClient} client
 */
module.exports = function (client) {

	let connected = true;
	client.on('error', (event) => {
		debug(`Cache server failed on (re)connecting or executing a command.`);
	});
	client.on('end', () => {
		debug(`Cache server is disconnected`);
		connected = false;
	});
	client.on('connect', () => {
		debug(`Cache server is (re)connected`);
		connected = true;
	});



	return {
		isConnected: () => connected,
		createKey,
		createKeyFromRequest,
		getRenderKey: getRenderKey.bind(null, client),
		setRenderKey: getRenderKey.bind(null, client),
	};
};
