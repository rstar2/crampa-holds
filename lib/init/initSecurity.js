const helmet = require('helmet');

module.exports = function (keystone) {

	// add the default Helmet middleware

	// Note there can be many "pre:static" hooks
	keystone.pre('static', helmet());

	// the same as:
	// var app = expr; ess()
	// app.use(helmet());
};
