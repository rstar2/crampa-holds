const { cssLinkTemplate, scriptTemplate } = require('./util');

const hbs = require('handlebars');
const keystone = require('keystone');

/**
* KeystoneJS specific helpers
* ===========================
*/
module.exports = {

	isAdminEditorCSS: function (user, options) {
		let output = '';
		if (typeof (user) !== 'undefined' && user.isAdmin) {
			output = cssLinkTemplate({
				href: '/keystone/styles/content/editor.min.css',
			});
		}
		return new hbs.SafeString(output);
	},
	isAdminEditorJS: function (user, options) {
		let output = '';
		if (typeof (user) !== 'undefined' && user.isAdmin) {
			output = scriptTemplate({
				src: '/keystone/js/content/editor.js',
			});
		}
		return new hbs.SafeString(output);
	},
	adminEditableUrl: function (user, id) {
		const rtn = keystone.app.locals.editable(user, {
			list: 'Post',
			id: id,
		});
		return rtn;
	},

};
