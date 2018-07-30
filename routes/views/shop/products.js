const keystone = require('keystone');

const { createGallery } = require('../../../lib/views');

const gallery = createGallery(keystone, 'products');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'shop';
	locals.gallery = gallery;

	// Load the products
	view.on('init', function (next) {

		const q = keystone.list('Product').paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
			filters: {
				state: 'published',
			},
		})
			.sort('-publishedDate')
			.populate('categories');

		q.exec(function (err, results) {
			locals.products = results;
			next(err);
		});
	});

	// Render the view
	view.render('shop/products');
};
