const keystone = require('keystone');


function cartUpdate(req, isDel = false) {
	const count = req.param.count || 1;
	const productId = req.param.productId;
	if (!productId) {
		req.flash('error', `No product specified to be ${isDel ? 'removed from' : 'added to'} the cart.`);
	} else {
		req.session.cart.products[productId] = +req.session.cart.products[productId]
			+ count * (isDel ? -1 : 1);
		if (isDel) {
			if (req.session.cart.products[productId] <= 0) {
				delete req.session.cart.products[productId];
			}
		}
		req.flash('info', `Product is ${isDel ? 'removed from' : 'added to'} the cart.`);
	}
}

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'shop';

	// Add a Product
	view.on('post', { action: 'product.add' }, function (next) {
		// create cart if not already created
		req.session.cart = req.session.cart || {};

		cartUpdate(req);

		next();
	});

	// Delete a Product
	view.on('get', { action: 'product.remove' }, function (next) {

		if (!req.session.cart) {
			req.flash('info', 'Cart is empty.');
			return next();
		}

		cartUpdate(req, true);

		next();
	});


	// Render the view
	view.render('shop/cart');
};
