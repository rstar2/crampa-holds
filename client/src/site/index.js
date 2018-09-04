// import all used FontAwesome icons (using SVG with JS)
import fontawesome from '@fortawesome/fontawesome';

// NOTE - explicitly enumerating all used FontAwesome icons greatly reduces the JS size
import faHome from '@fortawesome/fontawesome-free-solid/faHome';
import faInfo from '@fortawesome/fontawesome-free-solid/faInfo';
import faPencilAlt from '@fortawesome/fontawesome-free-solid/faPencilAlt';
import faImage from '@fortawesome/fontawesome-free-solid/faImage';
import faEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope';
import faEuroSign from '@fortawesome/fontawesome-free-solid/faEuroSign';
import faShoppingCart from '@fortawesome/fontawesome-free-solid/faShoppingCart';
import faChevronLeft from '@fortawesome/fontawesome-free-solid/faChevronLeft';
import faChevronRight from '@fortawesome/fontawesome-free-solid/faChevronRight';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faPhone from '@fortawesome/fontawesome-free-solid/faPhone';

import faFacebook from '@fortawesome/fontawesome-free-brands/faFacebookF';
import faInstagram from '@fortawesome/fontawesome-free-brands/faInstagram';


const icons = [
	faHome,
	faInfo,
	faPencilAlt,
	faImage,
	faEnvelope,
	faEuroSign,
	faShoppingCart,
	faChevronLeft,
	faChevronRight,
	faSearch,
	faPhone,
	faFacebook,
	faInstagram,
];
fontawesome.library.add(icons);


// import the custom site CSS/LESS
import './styles/index.less';

