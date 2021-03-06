/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

const keystone = require('keystone');
const middleware = require('./middleware');

const checkCache = require('../lib/middleware/renderCacheRedis');
const checkCrawlersSSO = require('../lib/middleware/renderCrawlersSSO');
const { createPageView } = require('../lib/views');

// do this only for pages needing SSO (e.g. prerendered already)
keystone.pre('routes', checkCrawlersSSO(keystone));

// the cache middleware is the first one
keystone.pre('routes', checkCache(keystone));


// Common Middlewares:
// 'pre:routes' Keystone hook is called first before passing to request to the router middleware
//                 (which is in fact this module's export)
// 'pre:render' is Keystone hook that is called firstly in the Keystone.View 'render' queue
keystone.pre('routes', middleware.initLocals);
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('render', middleware.flashMessages);
keystone.pre('render', middleware.cacheControl);

// Handle 404 errors
keystone.set('404', function (req, res, next) {
	// this is defined in middleware.initErrorHandlers
	res.notFound();
});

// Handle other errors
keystone.set('500', function (err, req, res, next) {
	let title, message;
	if (err instanceof Error) {
		message = err.message;
		err = err.stack;
	}
	// this is defined in middleware.initErrorHandlers
	res.error(err, title, message);
});

// Import Route Controllers
const importRoutes = keystone.importer(__dirname);
const routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api'),
};


// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.home);
	app.get('/blog', routes.views.blog);
	app.get('/blog/:post', routes.views.post);
	app.all('/contact', routes.views.contact);
	app.get('/gallery', routes.views.gallery);
	app.get('/shipping', routes.views.shipping);

	// these pages are just plain static text
	// maps section -> pages
	const pages = {
		/* eslint-disable */
		'about' : ['about', 'terms', 'privacy-policy', 'return-policy'],
		'news' : ['news'],
		/* eslint-enable */
	};
	Object.keys(pages ).forEach(section => {
		const pgs = pages[section];
		pgs.forEach(page => app.get(`/${page}`, createPageView(keystone, page, section)));
	});

	// allow to render custom dynamic pages (e.g. from the DB)
	app.get('/page/:page?', routes.views.page);

	// Shop related pages
	// app.get('/shop', routes.views.shop.index);
	app.get('/shop/products', routes.views.shop.products);
	app.get('/shop/product/:product', routes.views.shop.product);
	app.get('/shop/cart', routes.views.shop.cart);
	// this is the checkout integration
	// provider is currently allowed to be only 'paypal' (with 'create'/'execute' allowed actions)
	app.post('/shop/checkout/:provider/payment/:action', routes.views.shop.checkout);

	// Custom Admin related pages (for uploading files and etc...) - full SPA
	app.get('/admin(/*)?', routes.views.admin);

	// Attach to all API routes res.apiResponse() ...  methods
	app.all('/api/*', keystone.middleware.api);

	// authentication API (signin/signout)
	app.use('/api/auth', routes.api.auth);

	const apiProtected = [
		// allow registered users to API - return error if not
		middleware.requireAuth(keystone),

		// restrict CORS API (e.g. validate the request) - return json error if CORS is set and not met
		middleware.validateCorsAPI(keystone),

		// return proper CORS headers so that the client should accept the response
		keystone.middleware.cors,
	];

	// All API routes are protected and/or should allow CORS
	app.all('/api/*', ...apiProtected);

	app.use('/api/fileupload', routes.api.fileupload);
	app.use('/api/gallery', routes.api.gallery);
	app.use('/api/notify', routes.api.notify);
	app.use('/api/cache', routes.api.cache);
};
