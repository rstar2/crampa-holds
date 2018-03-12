const { createUrl } = require('./util');

const helpers = {

	shopUrl: function () {
		return `/shop`;
	},

	shopCategoryUrl: function (categorySlug) {
		return createUrl(`${helpers.shopUrl()}/category`, categorySlug);
	},

	productUrl: function (productSlug) {
		return createUrl(`${helpers.shopUrl()}/product`, productSlug);
	},

	totalPrice: function (price, qty) {
		return price * qty;
	},
};

module.exports = helpers;
