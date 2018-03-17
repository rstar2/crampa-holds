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

import App from './App';

import { registerBusEvents } from './bus';

// {{ifx user true false}}
// {{brand}}

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
		const props = { brand: data.brand, isAuthInit: data.isAuthInit };

		// when passed the initial property - commit it to the store
		// Note - it's straight commit - not dispatching an action
		this.$store.commit('authChange', { isAuth: data.isAuthInit });

		return createElement(App, { props });
	},
});
