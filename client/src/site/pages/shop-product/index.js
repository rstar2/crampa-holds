import Vue from 'vue';

import Slideshow from '../../components/slideshow/Slideshow.vue';

// TODO: this is BIG bundle
import Video from '../../components/video/Video.vue';

import wow from './wow.js';

// eslint-disable-next-line
new Vue({
	el: '#app',
	components: {
		'app-slideshow': Slideshow,
		'app-video': Video,
	},
	created () {
		wow();
	},
});


