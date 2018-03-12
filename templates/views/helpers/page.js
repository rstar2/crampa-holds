const { createUrl } = require('./util');

const helpers = {
	pageUrl: function (postSlug) {
		return createUrl('/page', postSlug);
	},
};

module.exports = helpers;
