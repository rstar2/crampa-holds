const keystone = require('keystone');

const { createGallery } = require('../../lib/views');

const gallery = createGallery(keystone, 'home');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	locals.gallery = gallery;

	// Render the view
	view.render('home', null, res.cache);
};
