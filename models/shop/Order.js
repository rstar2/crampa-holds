const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Order Model
 * =============
 */

const Order = new keystone.List('Order', {
	nocreate: true,
	// noedit: true,
});

Order.add({
	user: { type: Types.Relationship, ref: 'User', index: true },
	zone: Number,
	shippingAddress: { type: String },
	billingAddress: { type: String },
	additionalInfo: { type: String },
	createdAt: { type: Date, default: Date.now },
	paymentId: { type: String },
	paymentProvider: { type: String },
});
// add this arbitrary 'cart' schema directly to the Mongoose model,
// the Keystone model doesn't support this yet
Order.schema.add({
	products: [{
		id: String,
		quantity: Number,
	}],
});

Order.schema.methods.sendNotifications = function (callback) {
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

	const order = this;
	const brand = keystone.get('brand');

	keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {

		// TODO: merge with Enquiry.js sendNotification

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

		// TODO: send SMS notification
	});
};

Order.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Order.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotifications();
	}
});

Order.defaultSort = '-createdAt';
Order.defaultColumns = 'createdAt, user';
Order.register();
