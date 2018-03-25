const debug = require('debug')('app:routes:views:shop:checkout:paypal');
const _ = require('lodash');

const keystone = require('keystone');

const stripHTML = require('../../../lib/utils/stripHTML');
const ensureLimit = require('../../../lib/utils/ensureLimit');
const Cart = require('../../../lib/models/shop/Cart');
const paypal = require('../../../lib/payments/paypal');

const Order = keystone.list('Order');

/**
 * PayPal provider/gateway payment route
 * @param {Request} req HTTP incoming request
 * @param {String} action payment action - can be either 'create' or 'execute'
 * @param {Cart} cart the current session cart
 * @param {Function} callback could be called synchronously or asynchronously
 */
module.exports = function (req, action, opt = {}, callback) {
	switch (action) {
		case 'create':
			create(req, opt, callback);
			break;
		case 'execute':
			execute(req, callback);
			break;
		default:
			callback('Paypal-checkout - invalid action');
	}
};

/**
 * @param {Request} req
 * @param {Object} opt
 * @param {Function} callback
 */
function create (req, opt, callback) {
	// To check the REST API for full details on what/which props are allowed in the JSON
	// see https://developer.paypal.com/docs/api/payments/#definition-details

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
	// const transaction = {
	// 	amount: {
	// 		total: '38.00',
	// 		currency: 'EUR',
	// 		details: {
	// 			subtotal: '20.00',
	// 			shipping: '15.00',
	// 			tax: '3.00',
	// 			handling_fee: '1.00',
	// 			insurance: '1.00',
	// 			discount: '2.00',
	// 			// shipping_discount: '0'
	// 			// gift_wrap: '0'
	// 		},
	// 	},
	// 	item_list: {
	// 		items: [
	// 			{
	// 				sku: 'id1', // stock keeping number
	// 				name: 'item 1',
	// 				price: '10',
	// 				quantity: '2',
	// 				description: 'item 1 description',
	// 				currency: 'EUR',
	// 			},
	// 			/* {
	// 				sku: 'id2',
	// 				name: 'item 2',
	// 				price: '20',
	// 				quantity: '3',
	// 				description: 'item 2 description',
	// 				currency: 'EUR',
	// 			} */
	// 		],
	// 	},
	// 	description: 'The payment transaction description.',

	// 	// Maximum length: 165
	// 	// note_to_payee: 'The note to the recipient of the funds in this transaction.',

	// 	//Maximum length: 127
	// 	// custom: 'merchant custom data',

	// 	// shipping_address: {
	// 	// 	recipient_name: 'Betsy Buyer',
	// 	// 	line1: '111 First Street',
	// 	// 	city: 'Saratoga',
	// 	// 	country_code: 'US',
	// 	// 	postal_code: '95070',
	// 	// 	state: 'CA',
	// 	// },
	// };

	// req.session.cart is ensured to be valid
	const cart = new Cart(req.session.cart).toJSON();

	// this also is ensured to be valid - and of type ShippingZone
	const shippingZone = req.session.shippingZone;

	const currency = opt.currency || 'EUR';
	const total = toValidNum(cart.totalPrice)
		+ toValidNum(shippingZone.shipping)
		+ toValidNum(shippingZone.tax)
		- toValidNum(opt.discount);

	// TODO: limiting the string with ensureLimit() should be in the lib/paypal.js file
	const transaction = {
		amount: {
			total: toStringNum(total),
			details: {
				subtotal: toStringNum(cart.totalPrice),
				shipping: toStringNum(opt.shipping),
				tax: toStringNum(opt.tax),
				discount: toStringNum(opt.discount),
			},
			currency,
		},
		item_list: {
			items: Object.keys(cart.items).map(id => {
				const item = cart.items[id];
				return {
					sku: ensureLimit(id, 127),
					name: ensureLimit(item.product.title, 127),
					description: ensureLimit(stripHTML(item.product.description.brief.html), 127),
					price: toStringNum(item.product.price),
					quantity: toStringNum(item.qty),
					currency,
				};
			}),
		},
		description: ensureLimit(opt.description, 127),
	};

	// A free-form field that clients can use to send a note to the payer.
	// Maximum length: 165
	const note_to_payer = ensureLimit(opt.noteToPayer, 165);

	// The PayPal-generated ID for the merchant's payment experience profile
	// experience_profile_id:
	// TODO: test 'experience_profile_id'
	const experience_profile_id = undefined;

	paypal.create({ transaction, note_to_payer, experience_profile_id }, function (error, payment) {
		if (error) debug('Paypal-checkout - create payment failed');
		else debug('Paypal-checkout create - payment succeeded');

		// NOTE - Here we still don't have a shipping address

		callback(error, null, { paymentID: payment.id });
	});
}

function execute (req, callback) {
	const paymentID = req.body.paymentID;
	const payerID = req.body.payerID;

	// here it's not from type ShippingZone, as it's survived serialization
	const shippingZone = req.session.shippingZone;

	// TODO: validate the payer's shipping address with the selected shipping zone

	paypal.execute({ paymentID, payerID }, function (error, payment) {
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

		// TODO: create  the order
		// Order.Status.PAID
		const order = null; // new Order.model({});
		callback(error, order);
	});
}

/**
 *
 * @param {Number} [num]
 * @param {Number} [maxLength]
 * @returns {String|undefined}
 */
function toStringNum (num, maxLength = 10) {
	if (_.isUndefined(num) || _.isNull(num)) return undefined;

	if (_.isNumber(num)) {
		const str = '' + num;

		// no more than 10 chars validations
		if (str.length > maxLength) {
			debug(`Convert to string : ${num} is more than ${maxLength} characters`);
			throw new Error(`PaypalCheckout - Convert to string : ${num} is more than ${maxLength} characters`);
		}
		return str;
	}

	debug(`Invalid type to convert to string : ${num}`);
	throw new Error(`PaypalCheckout - Invalid type to convert to string : ${num}`);
}

/**
 *
 * @param {Number} [num]
 * @returns {Number}
 */
function toValidNum (num) {
	if (_.isUndefined(num) || _.isNull(num)) return 0;
	if (_.isNumber(num)) return num;

	debug(`Invalid type to convert to valid number : ${num}`);
	throw new Error(`PaypalCheckout - Invalid type to convert to valid number : ${num}`);
}
