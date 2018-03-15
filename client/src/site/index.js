// import all used FontAwesome icons (using SVG with JS)
import fontawesome from '@fortawesome/fontawesome';
import {
	faChevronLeft, faChevronRight, faShoppingCart, faTrash,
} from '@fortawesome/fontawesome-free-solid';
fontawesome.library.add(faChevronLeft, faChevronRight, faShoppingCart, faTrash);

// import the custom site CSS/LESS
import './index.less';

import Vue from 'vue';

new Vue({
	el: '#app',

	mounted () {
		console.log('Comments mounted');
	},
});

// TODO: Use Vue.js
// jQuery(function ($) {
// 	var comments = $('#comments');
// 	var input = $('.comment-field-input');
// 	var submit = comments.find('button[type=submit]');

// 	// Scroll to comments and focus input field
// 	$('[href="#comments"]').click(function scrollToComments(e) {
// 		e.preventDefault();

// 		$('html, body').animate({ scrollTop: comments.offset().top }, 250);

// 		input.eq(0).focus();
// 	});

// 	// Check if field has content: enable/disable submit. Disable by default
// 	submit.attr('disabled', 'disabled');
// 	input.keyup(function () {
// 		if ($.trim($(this).val())) {
// 			submit.removeAttr('disabled');
// 		} else {
// 			submit.attr('disabled', 'disabled');
// 		}
// 	});
// });
