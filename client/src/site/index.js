// import all used FontAwesome icons (using SVG with JS)
import fontawesome from '@fortawesome/fontawesome';

import faHome from '@fortawesome/fontawesome-free-solid/faHome';
import faPencilAlt from '@fortawesome/fontawesome-free-solid/faPencilAlt';
import faImage from '@fortawesome/fontawesome-free-solid/faImage';
import faEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope';
import faEuroSign from '@fortawesome/fontawesome-free-solid/faEuroSign';
import faShoppingCart from '@fortawesome/fontawesome-free-solid/faShoppingCart';
import faChevronLeft from '@fortawesome/fontawesome-free-solid/faChevronLeft';
import faChevronRight from '@fortawesome/fontawesome-free-solid/faChevronRight';

const icons = [
	faHome,
	faPencilAlt,
	faImage,
	faEnvelope,
	faEuroSign,
	faShoppingCart,
	faChevronLeft,
	faChevronRight,
];
fontawesome.library.add(icons);


// import the custom site CSS/LESS
import './index.less';
