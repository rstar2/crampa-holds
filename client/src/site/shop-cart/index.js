import Vue from 'vue';

import { init as initPaypal } from './paypal';

// needed as it uses the BootstrapVue components
new Vue({
	el: '#app-shop-cart',
});

// Initialize the PayPal button
// I'm using the Express Checkout with Server-side REST
// https://developer.paypal.com/docs/integration/direct/express-checkout/integration-jsv4/
const paypalButton = document.getElementById('paypal-button-container');

// when the cart is empty there will be no button rendered
if (paypalButton) {
	// get the PayPal mode/env(e.g. sandbox or production) as passed from the server
	const paypalMode = paypalButton.dataset.paypalMode || 'sandbox';
	initPaypal(paypalMode, '#paypal-button-container');
}
