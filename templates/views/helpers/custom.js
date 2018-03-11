const helpers = {

	/**
	 * Usage:
	 * {{ifx (is env '==' 'production') '.min' ''}}
	 */
	is: function (a, operator, b) {
		let bool = false;
		switch (operator) {
			case '===':
				bool = a === b;
				break;
			case '!==':
				bool = a !== b;
				break;
			case '==':
				// eslint-disable-next-line 
				bool = a == b;
				break;
			case '!=':
				// eslint-disable-next-line 
				bool = a != b;
				break;
			case '>':
				bool = a > b;
				break;
			case '>=':
				bool = a >= b;
				break;
			case '<':
				bool = a < b;
				break;
			case '<=':
				bool = a <= b;
				break;
			default:
				throw new Error('Unknown operator ' + operator);
		}
		return bool;
	},

	/**
	 * Usage:
	 * {{#iff name '==' 'Foo'}}
     *    true
     * {{else}}
     *    false
     * {{/iff}}
	 *
	 * {{else}} block is optional
	 */
	iff: function (a, operator, b, options) {
		const bool = helpers.is(a, operator, b);

		if (bool) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	},

	/**
	* Usage:
	* {{ifx name 'True' 'False'}}
	*/
	ifx: function (condition, ifVal, elseVal) {
		return condition ? ifVal : elseVal;
	},

	/**
	 * Checks if an object's ID is the same as the passed.
	 * The passed object must have 'id' property.
	 *
	 * Usage:
	 *
	 * {{isSame user '123456789'}}
	 * {{ifx (isSame category '123456789') 'active' ''}}
	 *
	 * {{#if (isSame user '12345') }}
     *    True
     * {{else}}
     *    False
     * {{/if}}
	 */
	isSame: function (obj, id) {
		return !!(obj && (obj === id || obj.id === id));
	},

	pageUrl: function (postSlug) {
		return createUrl('/page', postSlug);
	},

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

	toLowerCase: function (str) {
		return ('' + str).toLowerCase();
	},

	toUpperCase: function (str) {
		return ('' + str).toUpperCase();
	},
};

function createUrl (base, slug) {
	return slug ? `${base}/${slug}` : `${base}`;
}

module.exports = helpers;
