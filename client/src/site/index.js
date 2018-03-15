// import all used FontAwesome icons (using SVG with JS)
import fontawesome from '@fortawesome/fontawesome';
import faChevronLeft from '@fortawesome/fontawesome-free-solid/faChevronLeft';
import faChevronRight from '@fortawesome/fontawesome-free-solid/faChevronRight';
import faShoppingCart from '@fortawesome/fontawesome-free-solid/faShoppingCart';
fontawesome.library.add(faChevronLeft, faChevronRight, faShoppingCart);

// import the custom site CSS/LESS
import './index.less';

import Vue from 'vue';

new Vue({
	el: '#app',
});
