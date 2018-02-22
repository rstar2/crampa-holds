const fs = require('fs');
const path = require('path');
const morganDebug = require('morgan-debug');
const rfs = require('rotating-file-stream');

// configure the morgan logger middleware
// see https://github.com/expressjs/morgan
module.exports = function (keystone) {
	const env = keystone.get('env');
	const logDirectory = keystone.expandPath('logs');
	const logFile = 'access.log';

	let accessLogStream;
	switch (env) {
		case 'production': {
			// ensure log directory exists
			fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

			// create a rotating write stream
			accessLogStream = rfs(logFile, {
				interval: '1d', // rotate daily
				size: '10M', // rotate every 10 MegaBytes written
				maxFiles: 50, // maximum number of rotated files to be kept.
				compress: 'gzip', // compress rotated files
				path: logDirectory,
			});
			break;
		}
		case 'development': {
			// ensure log directory exists
			fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

			// create a write stream (in append mode)
			accessLogStream = fs.createWriteStream(path.join(logDirectory, logFile), { flags: 'a' });
			break;
		}
	}
	const morganOptions = { stream: accessLogStream };

	if (process.env.DEBUG_MORGAN) {
		// replace the default morgan logger with our custom morgan-debug
		const morganFormat = keystone.get('logger');
		keystone.set('logger', null);
		keystone.set('logging middleware',
			morganDebug('app:http', morganFormat || 'combined', morganOptions));
	} else {
		// so the default morgan logger will be used, so just configure it
		keystone.set('logger options', morganOptions);
	}

};
