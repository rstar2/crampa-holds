const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'shop';

	// PayPal Express Checkout
	// https://www.youtube.com/watch?v=7k03jobKGXM
	// https://github.com/paypal/PayPal-node-SDK
	// https://developer.paypal.com/developer/accounts
	// https://www.sandbox.paypal.com/signin 
	view.on('post', function (next) {
		// var newEnquiry = new Enquiry.model();
		// var updater = newEnquiry.getUpdateHandler(req);

		// updater.process(req.body, {
		// 	flashErrors: true,
		// 	fields: 'name, email, phone, enquiryType, message',
		// 	errorMessage: 'There was a problem submitting your enquiry:',
		// }, function (err) {
		// 	if (err) {
		// 		locals.validationErrors = err.errors;
		// 	} else {
		// 		locals.enquirySubmitted = true;
		// 	}
		// 	next();
		// });
	});

	// PayPal Classic Payment Button
	// https://developer.paypal.com/docs/integration/web/
	view.on('post', function (next) {
		// var newEnquiry = new Enquiry.model();
		// var updater = newEnquiry.getUpdateHandler(req);

		// updater.process(req.body, {
		// 	flashErrors: true,
		// 	fields: 'name, email, phone, enquiryType, message',
		// 	errorMessage: 'There was a problem submitting your enquiry:',
		// }, function (err) {
		// 	if (err) {
		// 		locals.validationErrors = err.errors;
		// 	} else {
		// 		locals.enquirySubmitted = true;
		// 	}
		// 	next();
		// });

	});


	// Render the view
	view.render('shop/checkout');
};
