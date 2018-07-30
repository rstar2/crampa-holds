const keystone = require('keystone');

const { createGallery } = require('../../../lib/views');

const galleries = {};

exports = module.exports = function (req, res) {

	const slug = req.params.product;

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'shop';

	// Load the current product
	view.on('init', function (next) {

		keystone.list('Product').model.findOne({
			state: 'published',
			slug,
		})
			.populate('categories')
			.exec(function (err, product) {
				locals.product = product;
				next(err);
			});

	});

	// Load the current product gallery
	view.on('init', function (next) {

		// load the product gallery if not already loaded
		if (!galleries[slug]) {
			galleries[slug] = createGallery(keystone, `products/${slug}`);
		}

		locals.gallery = galleries[slug];

		next();
	});

	// Load other products
	// view.on('init', function (next) {

	// 	keystone.list('Product').model.find()
	// 		.where('state', 'published')
	// 		.sort('-publishedDate')
	// 		.limit('4')
	// 		.exec(function (err, products) {
	// 			locals.products = products;
	// 			next(err);
	// 		});

	// });

	// Render the view
	view.render('shop/product');
};
