import Vue from 'vue';

import Slideshow from '../../components/slideshow/Slideshow.vue';
import Video from '../../components/video/Video.vue';

// eslint-disable-next-line
new Vue({
	el: '#app',
	components: {
		'app-slideshow': Slideshow,
		'app-video': Video,
	},
});

