// add the Promise and 'fetch' polyfills
import 'promise-polyfill/src/polyfill'; // polyfill if native don't exist
import 'whatwg-fetch';

import 'animate.css';

// just to show that CSS and LESS loading, compiling and packaging works by Webpack
import './index.css';
import './index.less';

import Vue from 'vue';

import store from './store';
import router from './router';

// A block-ui plugin for Vue
// Used: https://github.com/realdah/vue-blockui
import BlockUI from 'vue-blockui';
Vue.use(BlockUI);

// the main compoenent
import App from './App';

// the root component will be registered as a common Bus
// that will listen for any kind of events that are not state-related
// like currently showing of alerts
import { registerBusEvents } from './bus';

new Vue({
	el: '#app',
	store,
	router,
	created () {
		registerBusEvents(this);
	},
	render (createElement) {
		// get the initial values from the original element HTML5 dataset
		const data = this.$el.dataset;
		const brand = data.brand;
		// convert the string to boolean
		const isAuthInit = data.isAuthInit === 'true';
		const props = { brand, isAuthInit };

		// when passed the initial property - commit it to the store
		// Note - it's straight commit - not dispatching an action
		this.$store.commit('authChange', { isAuth: isAuthInit });

		return createElement(App, { props });
	},
});
