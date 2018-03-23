const debug = require('debug')('app:routes:views:shop:checkout');

const Cart = require('../../../lib/models/shop/Cart');

const listProviders = new Map();
listProviders.set('paypal', require('./checkout-paypal'));

exports = module.exports = function (req, res, next) {

	const locals = res.locals;

	// Set locals
	locals.section = 'shopping-cart';

	const cart = req.session.cart ? new Cart(req.session.cart) : null;
	// if (!cart) return next('Checkout failed - no cart');

	const providerKey = req.params.provider;
	const provider = listProviders.get(providerKey);
	if (!provider) return next(`Checkout failed - provider '${providerKey}' is not supported`);

	const action = req.params.action;

	provider(req, action, cart, function (error, data = {}) {
		if (error) return next(`Checkout failed - ${error}`);

		// TODO: save to DB as Order
		// 1. when payment is created with status 'created'
		// 2. when payment is executed with status 'paid'
		// 3. later when we ship it we will set it with status 'shipped'
		// 4. later when received - status 'completed'


		res.status(200).json(data);
	});
};
