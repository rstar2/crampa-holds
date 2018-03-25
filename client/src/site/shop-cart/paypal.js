/* globals paypal */

// Set up a url on your server to create the payment
const PAYMENT_URL_CREATE = '/shop/checkout/paypal/payment/create/';

// Set up a url on your server to execute the payment
const PAYMENT_URL_EXECUTE = '/shop/checkout/paypal/payment/execute/';

import { PAYPAL_STATE } from './index';


/**
 * @param {{mode: String, elButton: String, state: String}} paypalState
 */
export function init (paypalState) {

	paypal.Button.render({
		// sandbox | production
		env: paypalState.mode,

		// Show the buyer a 'Pay Now' button in the checkout flow
		commit: true,

		// Specify the style of the button
		style: {
			label: 'pay',    // checkout | credit | pay | buynow | paypal
			fundingicons: true, // optional
			// branding: true,     // optional
			// layout: 'vertical', // horizontal | vertical
			size: 'responsive',     // small | medium | large | responsive
			shape: 'rect',      // pill | rect
			color: 'blue',      // gold | blue | silver | black,
			// tagline: true,
		},

		/**
		 * Called when the button is clicked
		 */
		payment: function (data, actions) {
			paypalState.state = PAYPAL_STATE.STARTED;

			// Make a call to the server to set up the payment
			return paypal.request.post(PAYMENT_URL_CREATE)
				.then(function (res) {
					paypalState.state = PAYPAL_STATE.CREATED;
					return res.paymentID;
				});
		},

		/**
		 * Called when the buyer approves the payment
		 */
		onAuthorize: function (data, actions) {
			// // Get the payment and buyer details
			// return actions.payment.get().then(function(payment) {
			// 	console.log('Payment details:', payment);
			// });

			// Set up the data you need to pass to your server
			const params = {
				paymentID: data.paymentID,
				payerID: data.payerID,
			};

			// Make a call to your server to execute the payment
			return paypal.request.post(PAYMENT_URL_EXECUTE, params)
				.then(function (res) {
					paypalState.state = PAYPAL_STATE.SUCCESS;
				});
		},

		/**
		 * Called for every click on the PayPal button.
		 * For instance fire off any analytics beacons from here
		 */
		onClick: function () {
			// Google analytics example (taken from https://developers.google.com/analytics/devguides/collection/analyticsjs/events)
			// ga('send', {
			// 	hitType: 'event',
			// 	eventCategory: 'Checkout',
			// 	eventAction: 'button_click'
			// });
		},

		/**
		 * called when a buyer cancelled the payment
		 */
		onCancel: function (data, actions) {
			paypalState.state = PAYPAL_STATE.CANCELED;
		},

		/**
		 * Called when an error occurred during the transaction
		 */
		onError: function (err) {
			paypalState.state = PAYPAL_STATE.FAILED;
		},

	}, paypalState.elButton);

};
