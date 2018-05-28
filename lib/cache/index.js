// const hash = require('object-hash');
const { noop } = require('lodash');
const debug = require('debug')('app:cache');
const appName = process.env.REDIS_APP_NAME || 'app';

const createKey = (...args) => {
	return args.filter(arg => !!arg).join(':');
};
const hashKeyRender = createKey(appName, 'render');


/**
 * Build a valid cache key from this request
 * @param {Request} req Express request instance
 */
const createRenderKey = (req) => {
	let key = req.path;
	if (key.startsWith('/')) key = key.substring(1);
	key = key.replace(/\//g, ':');
	// NOTE - "" is valid key/field in REDIS

	let query;
	const queryKeys = Object.keys(req.query);
	if (queryKeys.length) {
		// 1. Simple plain (more readable) queryKeys
		query = '';
		query = queryKeys.sort().reduce((acc, q) => {
			return acc + q + '=' + req.query[q] + ';';
		}, '');

		// 2. or Hash the queryKeys
		// query = ':' + hash(req.query);
	}
	return createKey(key, query);
};

/**
 * @param {RedisClient} client
 * @param {String} reqField
 * @param {Function?} callback
 */
const getRenderKey = (client, reqField, callback = noop) => {
	// get the possible expiration time
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
				return callback(null, values[0]);
			}

		}

		// response is not cached
		callback(null, null);
	});

};

/**
 * Allow  setRenderKey(client, reqField, response, expire, callback) and
 * setRenderKey(client, reqField, response, callback)
 *
 * @param {RedisClient} client
 * @param {String} reqField
 * @param {String} response
 * @param {Number?} expire
 * @param {Function?} callback
 */
const setRenderKey = (client, reqField, response, expire = -1, callback = noop) => {
	if (expire instanceof Function) {
		callback = expire;
		expire = -1;
	}

	// TODO: store also the content type of the response if needed?
	// For now just assume all is plain HTML - so no need to set the response CONTENT-TYPE
	const cacheFields = [reqField, response];
	if (expire > 0) {
		// create a expire field (xxxxx:expire)
		const expireField = createKey(reqField, 'expire');
		cacheFields.push(expireField, Date.now() + expire * 1000);
	}

	// set multiple fields at once  - the real response and the expire time (this is because REDIS doesn't have expire on fields natively)
	client.hmset(hashKeyRender, cacheFields, function (err) {
		if (err) debug(`Failed to cache response for request ${reqField}`);
		else debug(`Cached response for request ${reqField} with expire - ${expire > 0 ? expire : 'never'}`);

		callback(err);
	});
};

const deleteRenderKey = (client, reqField, callback = noop) => {
	const cacheFields = [reqField, createKey(reqField, 'expire')];
	client.hdel(hashKeyRender, cacheFields, function (err, count) {
		if (err) debug(`Failed to delete cached response for request ${reqField}`);
		else debug(`Deleted response for request ${reqField}`);

		callback(err, count > 0 ? [reqField] : []);
	});
};

const scanDeleter = (client, hashKey, match) => {
	let deletedKeys = [];

	// NOTE - This will be implemented as not-atomic operation
	const scan = (cursor, callback) => {
		client.hscan(hashKey, cursor, 'MATCH', match, function (err, iteration) {
			if (err) {
				return callback(err, deletedKeys);
			}

			const next = (err) => {
				if (err) {
					return callback(err, deletedKeys);
				}

				if (cursor === 0) {
					// iteration finished
					return callback(null, deletedKeys);
				}

				// get next iteration
				scan(cursor, callback);
			};

			const cursor = +iteration[0];
			// in HSCAN the returned array of elements contain two elements for each matched field name - the field-name and and the stored value
			const elements = iteration[1];
			const keys = elements.filter((val, index) => index % 2 === 0);

			if (keys.length) {
				deletedKeys.push(...keys);
				client.hdel(hashKey, keys, next);
			} else {
				next(null);
			}
		});
	};

	return (callback) => {
		scan(0, callback);
	};
};


const deleteRenderPattern = (client, pattern, callback = noop) => {
	const scan = scanDeleter(client, hashKeyRender, createKey(pattern, '*'));
	scan(function (err, deletedKeys) {
		if (err) debug(`Failed to delete cached responses for pattern ${pattern}`);
		else debug(`Deleted responses for pattern ${pattern}`);

		if (err) return callback(err);

		// NOTE -  not all keys could have been removed in theory as this is  not atomic operation
		// but I assume as HSCAN returned them so they will finally be removed/not present after HDEL
		// even in the meantime other fields are added to the set

		// just try to delete the pattern a strictly matched-single key
		deleteRenderKey(client, pattern, function (err, deletedKey) {
			callback(err, deletedKey ? deletedKeys.concat(deletedKey) : deletedKeys);
		});
	});
};

const listRender = (client, callback = noop) => {
	client.hkeys(hashKeyRender, function (err, keys) {
		if (err) debug('Failed to get all cached keys for responses for requests');
		else debug('Get all cached keys for responses for requests');

		callback(err, keys);
	});
};

const purgeRender = (client, callback = noop) => {
	client.del(hashKeyRender, function (err) {
		if (err) debug('Failed to delete all cached responses for requests');
		else debug('Deleted all cached responses for request');

		callback(err);
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
		render: {
			createKey: createRenderKey,
			get: getRenderKey.bind(null, client),
			set: setRenderKey.bind(null, client),
			del: deleteRenderKey.bind(null, client),
			delPattern: deleteRenderPattern.bind(null, client),

			list: listRender.bind(null, client),
			purge: purgeRender.bind(null, client),
		},
	};
};
