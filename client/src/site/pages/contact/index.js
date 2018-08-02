import '../../styles/contact.less';

import Vue from 'vue';

import GoogleMap from '../../components/google-map/GoogleMap.vue';

new Vue({
	el: '#app',
	components: {
		'app-google-map': GoogleMap,
	},
});
