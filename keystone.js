// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');
var handlebars = require('express-handlebars');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.


const hbs = handlebars.create({
	layoutsDir: 'templates/views/layouts',
	partialsDir: 'templates/views/partials',
	defaultLayout: 'default',
	helpers: require('./templates/views/helpers')(),
	extname: '.hbs',
});

// add support for sections in templates:
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
	'name': 'Crampa Holds',
	'brand': 'Crampa Holds',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': '.hbs',

	'custom engine': hbs.engine,

	'emails': 'templates/emails',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
});

const env = keystone.get('env');
switch (env) {
	case 'production':
		// requires "npm install connect-mongo --save"
		console.log('Production mode - Use session store - MongoStore');
		keystone.set('session store', 'connect-mongo');
		break;
	case 'development':
		keystone.set('less options', {
			debug: true,
			render: {
				sourceMap: {
					sourceMapFileInline: true,
				},
			},
		});
		break;
}

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	posts: ['posts', 'post-categories', 'post-comments'],
	galleries: 'galleries',
	enquiries: 'enquiries',
	users: 'users',
	shop: ['products', 'product-categories', 'orders'],
});

// Start Keystone to connect to your database and initialise the web server


if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
	console.log('----------------------------------------'
		+ '\nWARNING: MISSING MAILGUN CREDENTIALS'
		+ '\n----------------------------------------'
		+ '\nYou have opted into email sending but have not provided'
		+ '\nmailgun credentials. Attempts to send will fail.'
		+ '\n\nCreate a mailgun account and add the credentials to the .env file to'
		+ '\nset up your mailgun integration');
}


keystone.start();
