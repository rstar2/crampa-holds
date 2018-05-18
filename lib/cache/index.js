const appName = process.env.REDIS_APP_NAME || 'crampa-holds';

const createKey = (...args) => {
	return args.join(':');
};
const hashKeyRender = createKey(appName, 'render');

exports.createKey = createKey;
