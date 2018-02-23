const path = require('path');

// configure the Less.js middleware
// see https://github.com/emberfeather/less.js-middleware
module.exports = function (keystone) {
	const env = keystone.get('env');

	switch (env) {
		case 'development':
			// generate source maps for the Less compiled files
			keystone.set('less options', {
				// debug: true,
				render: {
					sourceMap: {
						sourceMapFileInline: true,
						// sourceMapRootpath: 'root/less/',
						sourceMapBasepath: path.resolve(keystone.expandPath('public'), 'styles'),
					},
				},
			});
			break;
	}
};
