const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'about';

	// Load the shipping zones
	view.on('init', function (next) {

		keystone.list('ShippingZone').model.find()
			.sort('name')
			.exec(function (err, zones) {
				locals.shippingZones = zones;
				next(err);
			});
	});

	// Render the view
	view.render('shipping', null, res.cache);
};
