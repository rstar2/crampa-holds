const keystone = require('keystone');

const { createHeroImage } = require('../../../lib/views');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'shop';
	locals.gallery = { images: [] };

	// Load the products
	view.on('init', function (next) {
		const q = keystone.list('Product').paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
			filters: {
				state: 'published',
				parentProduct: null,
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
			// filter only products with images
			.filter(product => product.image)
			// "fix" the products' images public/static URLs
			.map(product => {
				product.image = createHeroImage(product.image);
				return product;
			})
			// create a dynamic 'gallery'
			.forEach(product => locals.gallery.images.push(product.image));
		next();
	});

	// Render the view
	view.render('shop/products');
};
