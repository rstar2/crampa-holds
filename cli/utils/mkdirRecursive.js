const fs = require('fs');

/**
 * Splits whole path into segments and checks each segment for existence
 * and recreates directory tree from the bottom.
 * If since some segment tree doesn't exist it will be created in series.
 * Existing directories will be skipped.
 * @param {String} directory
 */
module.exports = function mkdirSyncRecursive (directory) {
	const paths = directory.replace(/\\/g, '/').replace(/\/$/, '').split('/');

	for (let i = 1; i <= paths.length; i++) {
		const segment = paths.slice(0, i).join('/');
		!fs.existsSync(segment) ? fs.mkdirSync(segment) : null;
	}
};
