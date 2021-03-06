import Vue from 'vue';

import PayPalState from '../../lib/PayPalState';
import PayPalButton from '../../components/paypal/PayPalButton.vue';

// eslint-disable-next-line
new Vue({
	el: '#app-shop-cart',
	components: {
		'app-paypal-button': PayPalButton,
	},

	data: {
		paypalState: PayPalState.INIT,
		paypalError: null,

		// set from the server as initial values
		cartTotalPrice: 0,
		shippingZones: false,

		shippingZone: null,
	},
	computed: {
		totalPrice () {
			return this.cartTotalPrice + (this.shippingZone ? this.shippingZone.shipping : 0);
		},
		paypalFinished () {
			switch (this.paypalState) {
				case PayPalState.SUCCESS:
				case PayPalState.CANCELED:
				case PayPalState.FAILED:
					return true;
				default:
					return false;
			}
		},
		paypalFinishedText () {
			if (!this.paypalFinished) return '';
			switch (this.paypalState) {
				case PayPalState.SUCCESS:
					return 'Thank you for your payment. Your order will be processed as soon as possible.';
				case PayPalState.CANCELED:
					return 'Payment is canceled, we are sorry.';
				case PayPalState.FAILED:
					return `An error occurred processing your payment${this.paypalError ? ' - ' + this.paypalError + '.' : ', try again later.'}`;
			}
		},
		paypalRequestCreateData () {
			return {
				shippingZone: this.shippingZone ? this.shippingZone.id : null,
			};
		},
	},
	watch: {
		shippingZone: function (zone) {
			// if shippingZones are defined then a valid selected one is obligatory
			this.paypalState = !this.shippingZones || zone
				? PayPalState.READY : PayPalState.INIT;
		},
	},
	methods: {
		paypalStateChanged ({ state, error }) {
			this.paypalState = state;
			this.paypalError = error;

			if (state === PayPalState.SUCCESS) {
				// clear the cart badge

				// This not the "reactive" state, but because not the whole view is managed by Vue
				// this is the easiest solution. It's only one time action anyway.
				const cartBadge = document.getElementById('app-shopping-cart-badge');
				if (cartBadge) {
					cartBadge.innerHTML = '';
				}
			}
		},
	},
	created () {
		// get the props/data as pass from the server - passed as data-attributes of the main element
		const el = document.querySelector(this.$options.el);
		const data = el.dataset;

		if (data.cartTotalPrice !== undefined) this.cartTotalPrice = +data.cartTotalPrice;
		if (data.shippingZones !== undefined) this.shippingZones = (data.shippingZones === 'true');

		if (!this.shippingZones) this.paypalState = PayPalState.READY;
	},
});

