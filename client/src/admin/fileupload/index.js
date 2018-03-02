import Vue from 'vue';

import App from './FileUpload.vue';

new Vue({
	el: '#app-admin-fileupload',
	render: h => h(App),
});

import 'animate.css';

// just to show that CSS and LESS loading, compiling and packaging works by Webpack
import './index.css';
import './index.less';
