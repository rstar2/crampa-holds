const keystone = require('keystone');
const Enquiry = keystone.list('Enquiry');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'contact';
	locals.subjectOptions = Enquiry.fields.subject.options;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'contact' }, function (next) {

		const newEnquiry = new Enquiry.model();
		const updater = newEnquiry.getUpdateHandler(req);

		updater.process(req.body, {
			// parse these form fields
			fields: 'name, email, phone, subject, message',

			// set flash error message if failed
			flashErrors: true,
			errorMessage: 'There was a problem submitting your enquiry:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.detail;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});
	});

	view.render('contact', null, res.cache);
};
