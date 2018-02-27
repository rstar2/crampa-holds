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
	let create_payment_json = {
		intent: 'sale',
		payer: {
			payment_method: 'paypal',
		},
		redirect_urls: {
			return_url: 'http://return.url',
			cancel_url: 'http://cancel.url',
		},
		transactions: [{
			item_list: {
				items: [{
					name: 'item',
					sku: 'item',
					price: '1.00',
					currency: 'EUR',
					quantity: 1,
				}],
			},
			amount: {
				currency: 'EUR',
				total: '1.00',
			},
			description: 'This is the payment description.',
		}],
	};


	paypal.payment.create(create_payment_json, function (error, payment) {
		if (error) {
			throw error;
		} else {
			console.log('Create Payment Response');
			console.log(payment);
		}
	});

};


exports.charge = function () {

};
