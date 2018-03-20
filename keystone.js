// Simulate config options from your production environment by
// customizing the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
const keystone = require('keystone');
const handlebars = require('express-handlebars');

// Initialize Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.


const hbs = handlebars.create({
	layoutsDir: 'templates/views/layouts',
	partialsDir: 'templates/views/partials',
	defaultLayout: 'default',
	helpers: require('./templates/views/helpers')(),
	extname: '.hbs',
});
// expose the Handlebars instance
keystone.hbs = hbs;

// add support for sections in Handlebars templates:
// Usage:
//     In template.hbs :
//          {{{_sections.header}}}
//
//     In post.hbs :
//          {{#section 'header'}}
//             <h1>This is my Header Content</h1>
//	        {{/section}}
require('express-handlebars-sections')(hbs);

keystone.init({
	// the name of the KeystoneJS application - don't know if it's used anywhere ?
	'name': 'Crampa Holds',
	// Displayed in the top left hand corner of the Admin UI. I added it also in the site UI (title, nav-header) and in email-notifications
	'brand': 'Crampa Holds',

	// the root folder for the template views
	'views': 'templates/views',
	// the template view engine - Handlebars
	'view engine': '.hbs',
	'custom engine': hbs.engine,

	// the root folders for the template emails ans SMS
	// (it will again use Handlebars if don't specified differently)
	'emails': 'templates/emails',
	'sms': 'templates/sms',

	'favicon': 'public/favicon.ico',

	'auto update': true,

	// session and authentication
	'session': true,
	'auth': true,
	'user model': 'User',
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	brand: keystone.get('brand'),
	version: require('./package.json').version,
	utils: keystone.utils,
	ga: {
		property: process.env.GOOGLE_ANALYTICS_PROPERTY,
		domain: process.env.GOOGLE_ANALYTICS_DOMAIN,
	},
});


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	posts: ['posts', 'post-categories', 'post-comments'],
	pages: ['pages', 'page-categories'],
	shop: ['products', 'product-categories', 'orders'],
	// galleries: 'galleries',
	// enquiries: 'enquiries',
	// users: 'users',
});

// import/require all the files in the 'lib/init' directory and call them
// Note, each one of them must export a function with argument 'keystone'
const initFunctions = keystone.import('lib/init');
Object.keys(initFunctions).forEach(key => initFunctions[key](keystone));

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Start Keystone to connect to your database and initialize the web server
keystone.start();

if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
	console.log('----------------------------------------'
		+ '\nWARNING: MISSING MAILGUN CREDENTIALS'
		+ '\n----------------------------------------'
		+ '\nYou have opted into email sending but have not provided'
		+ '\nmailgun credentials. Attempts to send will fail.'
		+ '\n\nCreate a mailgun account and add the credentials to the .env file to'
		+ '\nset up your mailgun integration');
}
