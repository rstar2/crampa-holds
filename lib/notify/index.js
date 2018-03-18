const async = require('async');
const email = require('./email');
const sms = require('./sms');

const gateways = {
	email,
	sms,
};

function sendFor (subjectType, keystone, subject, methods = ['email'], callback = null) {
	if (typeof callback !== 'function') {
		callback = function (err) {
			if (err) {
				console.error('There was an error sending the notification email:', err);
			}
		};
	}

	// use async for sending to different gateways and there to be only one final CALLBACK
	async.map(methods,
		function (method, callback) {
			const gateway = gateways[method];
			if (!gateway) {
				return callback(null, `No notify-gateway defined for method '${method}'`);
			}

			email.sendFor(keystone, subjectType, subject, function (err, result) {
				// convert the item to a possible error
				callback(null, err);
			});
		},
		function (err, mappedErrors) {
			// this should never happen
			if (err) {
				return callback(err);
			}

			// filter out all null/undefined
			mappedErrors = mappedErrors.filter(item => !!item);

			// if all gateways have failed, e.g. only errors - then fail
			// otherwise at least one is succeeded then all is good
			if (mappedErrors.length === methods.length) {
				// if single error - just use it otherwise concatenate
				return callback(mappedErrors.length === 1 ? mappedErrors : mappedErrors.join());
			}

			callback(null);
		});
}

module.exports = {
	sendNotificationsForEnquiry: sendFor.bind(this, 'enquiry'),
	sendNotificationsForOrder: sendFor.bind(this, 'order'),
};
