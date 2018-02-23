const paypal = require('paypal-rest-sdk');

// 'sandbox' or 'live'
const mode = process.env.PAYPAL_MODE || 'sandbox';
const client_id = process.env.PAYPAL_APP_PUBLIC_ID;
const client_secret = process.env.PAYPAL_APP_SECRET;

paypal.configure({
	mode,
	client_id,
	client_secret,
});

exports.create = function () {

};


exports.charge = function () {

};
