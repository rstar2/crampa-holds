const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'gallery';
	locals.gallery = keystone.getGallery('main');

	// Render the view
	view.render('gallery', null, res.cache);
};
