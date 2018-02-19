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

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('render', middleware.flashMessages);

// Custom Less and Static middleware as
// I'll add 'quickthumb' support and because
// I'd like all statics to be under the '/public' route
keystone.set('pre:static', function (app) {
	const root = 'public';
	const rootExpanded = keystone.expandPath(root);

	// Note the Less middleware must be always before the static one
	app.use('/' + root, require('less-middleware')(rootExpanded, keystone.get('less options') || {}));

	// Note the Quickthumb middleware must be always before the static one
	// Usage: <img src="/public/images/image.gif?dim=80x40" />
	app.use('/' + root, require('quickthumb').static(rootExpanded));

	app.use('/' + root, keystone.express.static(rootExpanded, keystone.get('static options') || {}));
});

// Handle 404 errors
keystone.set('404', function (req, res, next) {
	// this is defined in middleware.initErrorHandlers
	res.notfound();
});

// Handle other errors
keystone.set('500', function (err, req, res, next) {
	var title, message;
	if (err instanceof Error) {
		message = err.message;
		err = err.stack;
	}
	// this is defined in middleware.initErrorHandlers
	res.err(err, title, message);
});

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api'),
};


// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.all('/blog/post/:post', routes.views.post);
	app.get('/gallery', routes.views.gallery);
	app.all('/contact', routes.views.contact);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

	app.get('/shop', routes.views.shop.index);
	app.get('/shop/product/:product', routes.views.shop.product);
	// app.get('/shop/cart', routes.views.shop.cart);
	// app.get('/shop/checkout', middleware.requireUser, routes.views.shop.checkout);

	// using express.Router()
	// var myRouter = keystone.createRouter(); // shorthand for require('express').Router
	// myRouter.get('/', (req, res) => res.send('hello router'));
	// myRouter.get('/sub', (req, res) => res.send('hello router sub'));
	// app.use('/router', myRouter);

	const apiProtected = [
		// attach res.apiResponse() ...  methods
		keystone.middleware.api,

		// allow registered users to API - return error if not
		middleware.requireUserAPI,

		// return proper CORS headers so that the client should accept the response
		keystone.middleware.cors,

		// restrict CORS API (e.g. validate the request) - return json error if CORS is set and not met
		middleware.validateCorsAPI,
	];

	// All API routes are protected
	// app.all.apply(app, [])
	app.all('/api/**', ...apiProtected);

	// API File Upload Route
	app.get('/api/fileupload/list', routes.api.fileupload.list);
	app.get('/api/fileupload/:id', routes.api.fileupload.get);
	app.all('/api/fileupload/:id/update', routes.api.fileupload.update);
	app.all('/api/fileupload/create', routes.api.fileupload.create);
	app.get('/api/fileupload/:id/remove', routes.api.fileupload.remove);
};
