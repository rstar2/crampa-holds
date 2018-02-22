const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

// configure the morgan logger middleware
// see https://github.com/expressjs/morgan
module.exports = function (keystone) {
	const env = keystone.get('env');
	const logDirectory = path.join(keystone.get('module root'), 'logs');

	let accessLogStream;
	switch (env) {
		case 'production': {
			// ensure log directory exists
			fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

			// create a rotating write stream
			accessLogStream = rfs('access.log', {
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
			accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });
			break;
		}
	}

	keystone.set('logger options', { stream: accessLogStream });
};
