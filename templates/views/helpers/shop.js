const _ = require('lodash');
const { createUrl } = require('./util');

const helpers = {

	shopUrl: function (part, options) {
		return createUrl('/shop', part);
	},

	shopCategoryUrl: function (categorySlug, options) {
		return createUrl(helpers.shopUrl('category'), categorySlug);
	},

	productUrl: function (productSlug, options) {
		return createUrl(helpers.shopUrl('product'), productSlug);
	},

	cartAddUrl: function (productId, options) {
		return helpers.shopUrl('cart') + '?action=product.add&id=' + productId;
	},

	cartRemoveUrl: function (productId, options) {
		return helpers.shopUrl('cart') + '?action=product.remove&id=' + productId
			+ (_.isString(options.hash.qty) ? '&qty=' + options.hash.qty : '');
	},

	totalPrice: function (price, qty, options) {
		return price * qty;
	},
};

module.exports = helpers;
