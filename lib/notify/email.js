exports.forEnquiry = function (keystone, enquiry, callback) {
	if (typeof callback !== 'function') {
		callback = function (err) {
			if (err) {
				console.error('There was an error sending the notification email:', err);
			}
		};
	}

	if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
		console.log('Unable to send email - no mailgun credentials provided');
		return callback(new Error('could not find mailgun credentials'));
	}

	const brand = keystone.get('brand');

	keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {
		if (err) return callback(err);
		new keystone.Email({
			templateName: 'enquiry',
			transport: 'mailgun',
		}).send({
			to: admins,
			subject: `New Enquiry for ${brand}`,
			from: { // this is the MAILGUN (or other transport) sending user
				name: 'Crampa Holds',
				email: 'contact@crampaclimb.com',
			},

			// these are locals for the template
			enquiry,
			brand,
			// this is whether the template should use a layout
			layout: false,
		}, callback);
	});
};

// TODO: extract common code

exports.forOrder = function (keystone, order, callback) {
	if (typeof callback !== 'function') {
		callback = function (err) {
			if (err) {
				console.error('There was an error sending the notification email:', err);
			}
		};
	}

	if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
		console.log('Unable to send email - no mailgun credentials provided');
		return callback(new Error('could not find mailgun credentials'));
	}

	const brand = keystone.get('brand');

	keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {
		if (err) return callback(err);
		new keystone.Email({
			templateName: 'order',
			transport: 'mailgun',
		}).send({
			to: admins,
			subject: `New Order for ${brand}`,
			from: { // this is the MAILGUN (or other transport) sending user
				name: 'Crampa Holds',
				email: 'contact@crampaclimb.com',
			},

			// these are locals for the template
			order,
			brand,
			// this is whether the template should use a layout
			layout: false,
		}, callback);
	});
};
