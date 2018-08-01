const keystone = require('keystone');

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

	// Load the current product gallery (in parallel after 'init' action, e.g. product is found)
	view.on('render', function (next) {

		locals.gallery = keystone.getGallery(`product/${slug}`);

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
