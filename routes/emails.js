/**
 * This file defines the email tests for your project.
 *
 * Each email test should provide the locals used to render the
 * email template for preview.
 *
 * Values can either be an object (for simple tests), or a
 * function that calls a callback(err, locals).
 *
 * Sample generated emails, based on the keys and methods below,
 * can be previewed at /keystone/test-email/{key}
 */

const keystone = require('keystone');

module.exports = {
	// TODO: Check and test all of these functionality

	/** New Enquiry Notifications */
	'enquiry-email': function (req, res, callback) {
		// To test enquiry notifications we create a dummy enquiry that
		// is not saved to the database, but passed to the template.

		const Enquiry = keystone.list('Enquiry');

		const newEnquiry = new Enquiry.model({
			name: { first: 'Test', last: 'User' },
			email: 'test@user.com',
			phone: '+61 2 1234 5678',
			enquiryType: 'message',
			message: { md: 'Nice enquiry notification.' },
		});

		callback(null, {
			admin: 'Admin User',
			enquiry: newEnquiry,
			enquiry_url: '/keystone/enquiries/',
		});
	},

	'order-email': function (req, res, callback) {

	},

	'order-sms': function (req, res, callback) {

	},

};
