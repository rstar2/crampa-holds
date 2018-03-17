const email = require('./email');
const sms = require('./sms');

function sendFor(subjectType, keystone, subject, gateways = ['email'], callback = null) {
	callback();
}

module.exports = {
	sendNotificationsForEnquiry: sendFor.bind(this, 'enquiry'),
	sendNotificationsForOrder: sendFor.bind(this, 'order'),
};
