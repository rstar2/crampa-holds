const fs = require('fs');
const path = require('path');

/**
 * Splits whole path into segments and checks each segment for existence
 * and recreates directory tree from the bottom.
 * If since some segment tree doesn't exist it will be created in series.
 * Existing directories will be skipped.
 * @param {String} directory
 */
const mkdirSync = function (directory) {
	const paths = directory.replace(/\\/g, '/').replace(/\/$/, '').split('/');

	for (let i = 1; i <= paths.length; i++) {
		const segment = paths.slice(0, i).join('/');
		!fs.existsSync(segment) ? fs.mkdirSync(segment) : null;
	}
};

/**
 * @param {String} input
 * @param {Boolean} [removeDot]
 */
const getExtension = function (input, removeDot = false) {
	const extension = path.extname(input);
	return removeDot ? extension.replace(/^\./, '') : extension;
};

/**
 * @param {String} input
 */
const getFileName = function (input) {
	const extension = getExtension(input);
	const fileName = path.basename(input).replace(extension, '');
	return fileName;
};


module.exports = {
	mkdirSync,
	getExtension,
	getFileName,
};
