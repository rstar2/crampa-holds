import Vue from 'vue';

import { init as initPaypal } from './paypal';

export const PAYPAL_STATE = {
	INIT: 'init',
	STARTED: 'started',
	CREATED: 'created',
	SUCCESS: 'success',
	CANCELED: 'canceled',
	FAILED: 'failed',
};

// needed as it uses the BootstrapVue components
new Vue({
	el: '#app-shop-cart',

	data: {
		paymentSuccess: false,
		paypal: {
			mode: '',
			elButton: '#paypal-button-container',
			state: 'init',
		},
	},
	computed: {
		paypalFinished () {
			switch (this.paypal.state) {
				case PAYPAL_STATE.SUCCESS:
				case PAYPAL_STATE.CANCELED:
				case PAYPAL_STATE.FAILED:
					return true;
				default:
					return false;
			}
		},
		paypalFinishedText () {
			if (!this.paypalFinished) return '';
			switch (this.paypal.state) {
				case PAYPAL_STATE.SUCCESS:
					return 'Thank you for your payment. Your order will be processed as soon as possible.';
				case PAYPAL_STATE.CANCELED:
					return 'Payment is canceled, we are sorry.';
				case PAYPAL_STATE.FAILED:
					return 'An error occurred processing your payment, try again later.';
			}
		},
	},
	mounted () {
		// Initialize the PayPal button
		// I'm using the Express Checkout with Server-side REST
		// https://developer.paypal.com/docs/integration/direct/express-checkout/integration-jsv4/
		const paypalButton = document.querySelector(this.paypal.elButton);

		// when the cart is empty there will be no button rendered
		if (paypalButton) {
			// get the PayPal mode/env(e.g. sandbox or production) as passed from the server
			this.paypal.mode = paypalButton.dataset.paypalMode || 'sandbox';
			initPaypal(this.paypal);
		}
	},
	watch: {
		'paypal.state': function (newValue) {
			// console.log('Paypal state changed', this.paypal.state);
			// clear the cart

			// This not the "reactive" state, but because not the whole view is managed by Vue
			// this is the easiest solution. It's only one time action anyway.
			if (newValue === PAYPAL_STATE.SUCCESS) {
				const cartBadge = document.getElementById('app-shopping-cart-badge');
				if (cartBadge) {
					cartBadge.innerHTML = '';
				}
			}
		},
	},
});

