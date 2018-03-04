import Vue from 'vue';
import VueRouter from 'vue-router';

// add the Promise and 'fetch' polyfills
import 'promise-polyfill/src/polyfill'; // polyfill if native don't exist
import 'whatwg-fetch';

import Admin from './Admin.vue';
import AdminHeader from './AdminHeader.vue';

import FileUpload from './fileupload/FileUpload.vue';
import Gallery from './gallery/Gallery.vue';

// register the VueRouter plugin in Vue
Vue.use(VueRouter);

const routes = [
	{ path: '/fileupload', component: FileUpload },
	{ path: '/gallery', component: Gallery },
];

// the server is configured to always serve the admin SPA page and so the client will handle the routing
const router = new VueRouter({
	base: '/admin',
	mode: 'history',
	routes,
});

new Vue({
	el: '#app-admin-header',
	router,
	render: h => h(AdminHeader),
});

new Vue({
	el: '#app-admin',
	router,
	render: h => h(Admin),
});

import 'animate.css';

// just to show that CSS and LESS loading, compiling and packaging works by Webpack
import './index.css';
import './index.less';
