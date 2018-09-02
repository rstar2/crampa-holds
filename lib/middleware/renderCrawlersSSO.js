module.exports = function (keystone) {
	return function (req, res, next) {
		// only GET requests could be prerendered for SSO (and for crawlers)
		if (req.method !== 'GET') return next();

		next();
	};
};
