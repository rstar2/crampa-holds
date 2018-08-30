const keystone = require('keystone');

const { createHeroImage } = require('../../../lib/views');

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
			// .populate('parentProduct')
			// .populate('subProducts')
			.exec(function (err, product) {
				locals.product = product;
				// product.getSubProducts();
				next(err);
			});
	});

	// load all "sub products"
	view.on('init', function (next) {
		locals.product.getSubProductsAll(function (err, subProducts) {
			locals.subProducts = subProducts;
			next(err);
		});
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


	// Load the current product gallery (in parallel after 'init' action, e.g. product is found)
	view.on('render', function (next) {
		locals.gallery = keystone.getGallery(`product/${slug}`);

		next();
	});
	// "Fix" current product's hero image public/static URL
	view.on('render', function (next) {
		if (locals.product.image) {
			locals.product.image = createHeroImage(locals.product.image);
		}

		next();
	});


	// Render the view
	view.render('shop/product');
};
