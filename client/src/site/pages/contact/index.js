import Vue from 'vue';

import GoogleMap from '../../components/google-map/GoogleMap.vue';

// eslint-disable-next-line
new Vue({
	el: '#app',
	components: {
		'app-google-map': GoogleMap,
	},
});
