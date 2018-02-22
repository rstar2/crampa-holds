const i18n = require('i18n');

module.exports = function (keystone) {
	// add internalization
	i18n.configure({
		locales: ['en', 'de'],
		cookie: 'locale',
		directory: keystone.expandPath('locales'),
	});

	// register middleware
	// default: using 'accept-language' header to guess language settings
	// or first the 'locale' cookie
	keystone.pre('routes', i18n.init);

	// Usage in global scope:
	// let greeting = i18n.__('Hello');

	// Usage in templates:
	// register handlebars helpers in res.locals' context which provides this.locale
	const handlebars = keystone.hbs.handlebars;
	handlebars.registerHelper('__', function () {
		return i18n.__.apply(this, arguments);
	});
	handlebars.registerHelper('__n', function () {
		return i18n.__n.apply(this, arguments);
	});
	// {{{__ "text to test"}}}
	// Note if the key "text to test" is not already localized in the locale language JSON file
	// it will be added in the default locale JSON file with the same value as the key.
	// This means that if we use English (en) for instance as default there's no need to localize them
	// explicitly in the en.json file

	// // TODO:
	// // http://127.0.0.1:3000/de
	// app.get('/de', function (req, res) {
	// 	res.cookie('locale', 'hu', { maxAge: 900000, httpOnly: true });
	// 	res.redirect('back');
	// });
	// // http://127.0.0.1:3000/en
	// app.get('/en', function (req, res) {
	// 	res.cookie('locale', 'en', { maxAge: 900000, httpOnly: true });
	// 	res.redirect('back');
	// });

};
