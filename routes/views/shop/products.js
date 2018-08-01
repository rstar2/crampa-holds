const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'shop';

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

	// finally ma all product Hero images to the correct path
	view.on('render', function (next) {
		locals.products.results
			.filter(product => product.image)
			.forEach(product => (product.image = `/upload/featured/${product.image}`));
		next();
	});

	// Render the view
	view.render('shop/products');
};
