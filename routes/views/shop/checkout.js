const debug = require('debug')('app:routes:views:shop:checkout');
const _ = require('lodash');

const keystone = require('keystone');

const Order = keystone.list('Order');

const listProviders = new Map();
listProviders.set('paypal', require('./checkout-paypal'));

exports = module.exports = function (req, res, next) {

	const view = new keystone.View(req, res);

	if (!req.session.cart) return next('Checkout failed - no cart');

	const providerKey = req.params.provider;
	const provider = listProviders.get(providerKey);
	if (!provider) return next(`Checkout failed - provider '${providerKey}' is not supported`);

	const action = req.params.action;

	let shippingZone;
	let details;

	// the details are needed only on 'create' action
	if (action === 'create') {

		// get the shipping zone if any
		view.on('render', function (next) {
			const shippingZoneId = req.body.shippingZone;

			// selected shipping zone is obligatory
			if (!_.isUndefined(shippingZoneId)) {
				keystone.list('ShippingZone').model.findById(shippingZoneId)
					.exec(function (err, zone) {
						if (err) return next(err);

						shippingZone = zone;
						next();
					});
			} else {
				next('No shipping zone provided');
			}
		});

		view.on('render', function (next) {
			// remember selected shippingZon in the session
			req.session.shippingZone = shippingZone;
			details = {
				currency: 'EUR',
				shippingZone,
				// discount: 20,
				noteToPayer: 'Contact us for any questions on your order.',
				description: 'The payment transaction description.',
			};
			next();
		});
	}

	view.render(function (error) {
		if (error) return next(`Checkout failed - ${error}`);

		provider(req, action, details, function (error, order, data = {}) {
			if (error) return next(`Checkout failed - ${error}`);

			// the Order model may not be created on each checkout-flow step,
			// this could depend on the provider
			if (order) {
				switch (order.status) {
					case Order.Status.CREATED:
						break;
					case Order.Status.PAID:
						// empty current session cart and shippingZone
						delete req.session.cart;
						delete req.session.shippingZone;
						break;
					default:
						debug(`Unsupported order status: ${order.status}`);
						throw new Error(`Checkout - Unsupported order status: ${order.status}`);
				}
				// TODO: save it to DB as Order
			}

			// repass the needed data to the client
			res.status(200).json(data);
		});
	});

};
