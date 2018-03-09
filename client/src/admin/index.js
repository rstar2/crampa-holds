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
import AppAuth from './auth/Auth.vue';

import { registerBusEvents } from './bus';

new Vue({
	el: '#app',
	store,
	router,
	components: {
		'app-auth': AppAuth,
	},
	created () {
		registerBusEvents(this);
	},
});
