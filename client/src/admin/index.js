import Vue from 'vue';

// add the Promise and 'fetch' polyfills
import 'promise-polyfill/src/polyfill'; // polyfill if native don't exist
import 'whatwg-fetch';

import App from './App.vue';
import AppHeader from './AppHeader.vue';
import AppAuth from './auth/Auth.vue';

import store from './store';
import router from './router';

// Keep this the first Vue component as it will initially set the  'isAuth' state
new Vue({
	el: '#app-auth',
	store,
	render (createElement) {
		// get the HTML attribute from the element and converted to a property to be passed to
		// the the Vue component
		const isAuthAttr = this.$el.getAttribute('data-is-auth');
		const isAuth = isAuthAttr === 'true';
		// convert the "true"/"false" string to a boolean (e.g. only "true" means TRUE)
		// NOTE - it's a straight commit - not an action
		this.$store.commit('authChange', { isAuth });
		return createElement(AppAuth, /* {
			props: {
				isAuth,
			},
		} */);
	},
});

new Vue({
	el: '#app-header',
	store,
	router,
	render: h => h(AppHeader),
});

new Vue({
	el: '#app',
	store,
	router,
	render: h => h(App),
});

import 'animate.css';

// just to show that CSS and LESS loading, compiling and packaging works by Webpack
import './index.css';
import './index.less';
