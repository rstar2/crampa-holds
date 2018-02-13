var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'shop';

	// Load the current product
	view.on('init', function (next) {

		keystone.list('Product').model.findOne({
			state: 'published',
			slug: req.params.product,
		})
			.populate('author categories')
			.exec(function (err, product) {
				locals.product = product;
				next(err);
			});

	});

	// Load other products
	view.on('init', function (next) {

		keystone.list('Product').model.find()
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author')
			.limit('4')
			.exec(function (err, products) {
				locals.products = products;
				next(err);
			});

	});

	// Render the view
	view.render('product');
};
