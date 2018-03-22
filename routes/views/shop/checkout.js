const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'shop';

	view.on('post', function (next) {
	});

	// Render the view
	view.render('shop/checkout');
};
