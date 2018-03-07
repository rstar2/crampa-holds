import Vue from 'vue';

// add the Promise and 'fetch' polyfills
import 'promise-polyfill/src/polyfill'; // polyfill if native don't exist
import 'whatwg-fetch';

import App from './App.vue';
import AppHeader from './AppHeader.vue';
import AppAuth from './auth/Auth.vue';

import store from './store';
import router from './router';


new Vue({
	el: '#app-admin',
	store,
	router,
	render: h => h(App),
});

new Vue({
	el: '#app-admin-header',
	store,
	router,
	render: h => h(AppHeader),
});

new Vue({
	el: '#app-admin-auth',
	store,
	render (createElement) {
		// get the HTML attribute from the element and converted to a property to be passed to
		// the the Vue component
		const isAuthAttr = this.$el.getAttribute('data-is-auth');
		return createElement(AppAuth, {
			props: {
				// convert the "true"/"false" string to a boolean (e.g. only "true" means TRUE)
				isAuth: isAuthAttr === 'true',
			},
		});
	},
});

import 'animate.css';

// just to show that CSS and LESS loading, compiling and packaging works by Webpack
import './index.css';
import './index.less';
