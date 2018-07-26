import Vue from 'vue';

// https://github.com/imgix/luminous
import { LuminousGallery } from 'luminous-lightbox';
import 'luminous-lightbox/dist/luminous-basic.min.css';

import './index.less';

new Vue({
	el: '#app',
	mounted () {
		new LuminousGallery(this.$el.querySelectorAll('.gallery-item'), {
			// Whether pressing the arrow keys should move to the next/previous slide.
			arrowNavigation: true,
		});
	},
});


