const debug = require('debug')('app:routes:views:shop:checkout:paypal');

const Cart = require('../../../lib/models/shop/Cart');
const paypal = require('../../../lib/payments/paypal');

/**
 * PayPal provider/gateway payment route
 * @param {Request} req HTTP incoming request
 * @param {String} action payment action - can be either 'create' or 'execute'
 * @param {Cart} cart the current session cart
 * @param {Function} callback could be called synchronously or asynchronously
 */
module.exports = function (req, action, cart, callback) {
	switch (action) {
		case 'create':
			create(cart, callback);
			break;
		case 'execute':
			execute(req, callback);
			break;
		default:
			callback('Paypal-checkout - invalid action');
	}
};

function create (cart, callback) {
	// TODO: parse the cart and create the items, amount and etc.
	//  = {
	// 	item_list: {
	// 		items: [{
	// 			name: 'item',
	// 			sku: 'item',
	// 			price: '1.00',
	// 			currency: 'EUR',
	// 			quantity: 1,
	// 		}],
	// 	},
	// 	amount: {
	// 		currency: 'EUR',
	// 		total: '1.00',
	// 	},
	// 	description: 'This is the payment description.',
	// };

	const currency = 'EUR';

	// NOTE - total amount must sum up to all details
	// + subtotal = 10 * 2 + 20 * 3
	// + shipping = 15
	// + tax = 3
	// + handling_fee = 1
	// + insurance = 1
	// + gift_wrap = 0
	// - shipping_discount = 0
	// - discount = 2
	// --------------
	//  98 EUR
	const transaction = {
		amount: {
			total: '98.00',
			currency,
			details: {
				subtotal: '80.00',
				shipping: '15.00',
				tax: '3.00',
				handling_fee: '1.00',
				insurance: '1.00',
				discount: '2.00',
				// shipping_discount
				// gift_wrap  
			},
		},
		item_list: {
			items: [
				{
					sku: 'idItem1', // stock keeping number
					name: 'item 1',
					price: '10',
					quantity: '2',
					description: 'item 1 description',
					currency,
				},
				{
					sku: 'idItem2',
					name: 'item 2',
					price: '20',
					quantity: '3',
					description: 'item 2 description',
					currency,
				}],
		},
		description: 'The payment transaction description.',

		// Maximum length: 165
		// note_to_payer: 'Contact us for any questions on your order.',

		// invoice_number: 'merchant invoice',

		//Maximum length: 127
		// custom: 'merchant custom data',

		// shipping_address: {
		// 	recipient_name: 'Betsy Buyer',
		// 	line1: '111 First Street',
		// 	city: 'Saratoga',
		// 	country_code: 'US',
		// 	postal_code: '95070',
		// 	state: 'CA',
		// },
	};


	paypal.create(transaction, function (error, payment) {
		if (error) debug('Paypal-checkout - create payment failed');
		else debug('Paypal-checkout create - payment succeeded');

		// NOTE - Here we still don't have a shipping address

		callback(error, { paymentID: payment.id });
	});
}

function execute (req, callback) {
	const paymentID = req.body.paymentID;
	const payerID = req.body.payerID;

	paypal.execute(paymentID, payerID, function (error, payment) {
		if (error) debug('Paypal-checkout - execute payment failed');
		else debug('Paypal-checkout - execute payment succeeded');

		// NOTE - Here we do have a shipping address
		// (either on the payer level or on a transaction level if we created the transaction with shipping address)

		// payment == {
		//     	...
		//     	payer: {
		//     		payment_method: 'paypal',
		//     		payer_info: {
		//     			email: 'bbuyer@example.com',
		//     			first_name: 'Betsy',
		//     			last_name: 'Buyer',
		//     			payer_id: 'CR87QHB7JTRSC',
		//              shipping_address: {
		//     				recipient_name: "Brian Robinson",
		//     				line1: "4th Floor",
		//     				line2: "Unit #34",
		//     				city: "San Jose",
		//     				state: "CA",
		//     				phone: "011862212345678",
		//     				postal_code: "95131",
		//     				country_code: "US"
		//     			}
		//     		},
		//     },
		//     transactions: [...]

		// };


		callback(error);
	});
}
