const keystone = require('keystone');

const { createGallery } = require('../../lib/views');

const gallery = createGallery(keystone, 'main');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'gallery';
	locals.images = gallery.images;

	// Render the view
	view.render('gallery', null, res.cache);

};
