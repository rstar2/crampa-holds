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
 * @param {String} galleryFolder
 * @returns {{images: [], videos: []} gallery with images and videos
 */
exports.createGallery = require('./createGallery');

/**
 * Gets a registered gallery for given slug and folder,
 * if not already  created the gallery is first created.
 *
 * @param {Keystone} keystone
 * @param {String} galleryFolder
 * @param {String} [slug] if not set use the galleryFolder as slug
 * @returns {{images: [], videos: []} gallery with images and videos
 */
exports.getGallery = require('./managerGallery');

/**
 * Creates a Hero/Featured image public/static URL.
 *
 * @param {String} image
 * @returns {String} public/static image URL
 */
exports.createHeroImage = (image) => {
	return `/uploads/images/featured/${image}`;
};
