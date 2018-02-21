const keystone = require('keystone');

const Cart = require('../../../lib/shop/Cart');


function _cartUpdate (req, isDel, callback) {
	const quantity = req.query.qty || 1;
	const productId = req.query.id;
	if (!productId) {
		return callback(`No product specified to be ${isDel ? 'removed from' : 'added to'} the cart.`);
	} else {
		let cart = new Cart(req.session.cart);
		if (isDel && cart.isEmpty()) {
			return callback('Cart is empty.');
		}

		keystone.list('Product').model.findById(productId)
			.exec(function (err, product) {
				if (!err) {
					if (isDel) {
						cart.remove(product, quantity);
					} else {
						cart.add(product, quantity);
					}
					// update the cart in the session
					// Note - it needs to be serialized so we have to pass plain objects
					if (cart.isEmpty()) {
						delete req.session.cart;
					} else {
						req.session.cart = cart.toJSON();
					}
				}
				callback(err);
			});
	}
}

function cartUpdate (req, res, next, isDel = false) {
	_cartUpdate(req, isDel, function (error, cart) {
		if (req.headers.accept === 'application/json') {
			// if this is AJAX request - return JSON
			if (error) {
				return res.status(400).json({ error });
			} else {
				return res.status(200).json({ cart: req.session.cart });
			}
		} else {
			// otherwise continue to render the view
			if (error) {
				req.flash('error', error);
			} else {
				req.flash('info', `Product is ${isDel ? 'removed from' : 'added to'} the cart.`);
			}

			// if the requests are GET then the query params will be still visible in the URL in the browser
			// next();

			// this will redirect to the current page without the query
			res.redirect(req.path); // in this case the '/shop/cart'

			// this will redirect to the cart
			// res.redirect('/shop/cart'); // explicitly set if the routes for add/remove are different from listing

			// this will redirect back to the place this request is coming
			// res.redirect(req.headers.referer);
		}
	});
}

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'shopping-cart';

	// Add a Product
	view.on('get', { action: 'product.add' }, function (next) {
		cartUpdate(req, res, next);
	});

	// Delete a Product
	view.on('get', { action: 'product.remove' }, function (next) {
		cartUpdate(req, res, next, true);
	});


	// Render the view
	view.render('shop/cart');
};
