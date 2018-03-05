import Vue from 'vue';
import VueRouter from 'vue-router';

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

export { router as default };
