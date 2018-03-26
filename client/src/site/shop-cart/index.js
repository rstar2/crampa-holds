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
			mode: 'sandbox',
			elButton: '#paypal-button-container',
			state: 'init',
		},

		// set from the server as initial values
		cartTotalPrice: 0,
		shippingZones: false, // TODO: use this to make 'shippingZone' be obligatory to be selected


		shippingZone: null,
	},
	computed: {
		totalPrice () {
			return this.cartTotalPrice + (this.shippingZone ? this.shippingZone.shipping : 0);
		},
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
	created () {
		// get the props/data as pass from the server - passed as data-attributes of the main element
		const el = document.querySelector(this.$options.el);
		const data = el.dataset;
		if (data.paypalMode !== undefined) this.paypal.mode = data.paypalMode;
		if (data.cartTotalPrice !== undefined) this.cartTotalPrice = +data.cartTotalPrice;
		if (data.shippingZones !== undefined) this.shippingZones = data.shippingZones === 'true';
	},
	mounted () {
		// Initialize the PayPal button
		// I'm using the Express Checkout with Server-side REST
		// https://developer.paypal.com/docs/integration/direct/express-checkout/integration-jsv4/
		const paypalButton = document.querySelector(this.paypal.elButton);

		// when the cart is empty there will be no button rendered
		if (paypalButton) {
			initPaypal(this.paypal);
		}
	},
	watch: {
		'paypal.state': function (state) {
			// console.log('Paypal state changed', this.paypal.state);
			// clear the cart

			// This not the "reactive" state, but because not the whole view is managed by Vue
			// this is the easiest solution. It's only one time action anyway.
			if (state === PAYPAL_STATE.SUCCESS) {
				const cartBadge = document.getElementById('app-shopping-cart-badge');
				if (cartBadge) {
					cartBadge.innerHTML = '';
				}
			}
		},
	},
});

