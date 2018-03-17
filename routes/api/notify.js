/**
 * Router for testing sending notifications - emails and SMS-es
 */

const keystone = require('keystone');

const { sendNotificationsForEnquiry, sendNotificationsForOrder } = require('../../lib/notify');

// API Test notifications - sending emails and SMS-es
const router = keystone.createRouter();
router.post('/enquiry/email', emailForEnquiry);
router.post('/order/email', emailForOrder);
router.post('/order/sms', smsForOrder);

module.exports = router;


function emailForEnquiry (req, res, next) {
	// To test enquiry notifications we create a dummy enquiry that
	// is not saved to the database, but passed to the template.
	const Enquiry = keystone.list('Enquiry');
	const newEnquiry = new Enquiry.model({
		name: req.body.name, // firstName and LastName
		email: req.body.email,
		phone: req.body.phone,
		enquiryType: 'message',
		message: { md: req.body.message },
	});

	sendNotificationsForEnquiry(keystone, newEnquiry, ['email'], (error) => {
		if (error) {
			return res.apiError(error);
		}
		res.apiResponse({
			success: true,
		});
	});
}

function emailForOrder (req, res, callback) {
	// TODO: 
}

function smsForOrder (req, res, callback) {
	// TODO:
}
