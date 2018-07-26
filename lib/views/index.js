/**
 * Creates a almost static page view.
 *
 * @param {Keystone} keystone
 * @param {String} page
 * @param {String} [section]
 * @returns {Function} express-middleware style function
 */
exports.createPageView = (keystone, page, section, toCache = true) => {
	return (req, res) => {
		const view = new keystone.View(req, res);
		const locals = res.locals;

		// Init locals
		locals.section = section || page;

		view.render(page, null, toCache ? res.cache : null);
	};
};

/**
 * Creates a gallery from given folder.
 *
 * @param {Keystone} keystone
 * @param {String} gallery
 * @returns {{images: [], videos: []} gallery with images and videos
 */
exports.createGallery = require('./createGallery');
