
const localizationRouter = require('./initLocalization').localizationRouter;

module.exports = function (keystone) {

	// Custom Less and Static middleware as
	// I'll add 'quickthumb' support and because
	// I'd like all statics to be under the '/public' route
	keystone.set('pre:static', function (app) {
		const staticRoot = 'public';
		const staticRootExpanded = keystone.expandPath(staticRoot);

		// Note the Less middleware must be always before the static one
		app.use('/' + staticRoot, require('less-middleware')(staticRootExpanded, keystone.get('less options') || {}));

		// Note the Quickthumb middleware must be always before the static one
		// Usage: <img src="/public/images/image.gif?dim=80x40" />
		app.use('/' + staticRoot, require('quickthumb').static(staticRootExpanded));

		app.use('/' + staticRoot, keystone.express.static(staticRootExpanded, keystone.get('static options') || {}));


		app.use(localizationRouter(keystone));
	});

};
