import Vue from 'vue';

// add the Promise and 'fetch' polyfills
import 'promise-polyfill/src/polyfill'; // polyfill if native don't exist
import 'whatwg-fetch';

import Admin from './Admin.vue';
import AdminHeader from './AdminHeader.vue';

import store from './store';
import router from './router';

new Vue({
	el: '#app-admin-header',
	store,
	router,
	render: h => h(AdminHeader),
});

new Vue({
	el: '#app-admin',
	store,
	router,
	render: h => h(Admin),
});

import 'animate.css';

// just to show that CSS and LESS loading, compiling and packaging works by Webpack
import './index.css';
import './index.less';
