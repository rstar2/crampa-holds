const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'shop';

	// On POST requests, add the Enquiry item to the database
	view.on('post', function (next) {

		console.log();

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
