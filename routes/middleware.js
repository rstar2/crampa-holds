/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
const _ = require('lodash');


/**
	Initializes the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
		{ label: 'Blog', key: 'blog', href: '/blog' },
		{ label: 'Gallery', key: 'gallery', href: '/gallery' },
		{ label: 'Contact', key: 'contact', href: '/contact' },
		{ label: 'Shop', key: 'shop', href: '/shop' },
	];
	res.locals.user = req.user;
	next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	let flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (messages) {
		return messages.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		// req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};

/**
	Prevents people from accessing protected API when they're not signed in
 */
exports.validateCorsAPI = function (req, res, next) {
	// Check if this is API call is allowed
	// this has to be done before the real work middleware is hit
	// and after the core keystone,middleware.cors that sets the CORS headers
	// according to the settings

	// TODO:
	let isAllowed = true;
	// var origin = keystone.get('cors allow origin');
	// if (origin) {
	// 	res.header('Access-Control-Allow-Origin', origin === true ? '*' : origin);
	// }

	// if (keystone.get('cors allow methods') !== false) {
	// 	res.header('Access-Control-Allow-Methods', keystone.get('cors allow methods') || 'GET,PUT,POST,DELETE,OPTIONS');
	// }
	// if (keystone.get('cors allow headers') !== false) {
	// 	res.header('Access-Control-Allow-Headers', keystone.get('cors allow headers') || 'Content-Type, Authorization');
	// }

	if (!isAllowed) {
		res.apiNotAllowed(null, 'CORS is not allowed');
	} else {
		next();
	}
};

/**
    Inits the error handler functions into `res`
*/
exports.initErrorHandlers = function (req, res, next) {

	res.err = function (err, title, message) {
		res.status(500).render('errors/500', {
			err: err,
			errorTitle: title,
			errorMsg: message,

			// this is for express-handlebars to set that we don't want the default layout
			layout: false,
		});
	};

	res.notfound = function (title, message) {
		res.status(404).render('errors/404', {
			errorTitle: title,
			errorMsg: message,

			// this is for express-handlebars to set that we don't want the default layout
			layout: false,
		});
	};

	next();
};
