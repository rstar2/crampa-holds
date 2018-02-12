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
	cart: {
		products: [{
			id: String,
			quantity: Number,
		}],
	},
	zone: Number,
});

// Order.schema.methods.sendNotificationEmail = function (callback) {
// 	if (typeof callback !== 'function') {
// 		callback = function (err) {
// 			if (err) {
// 				console.error('There was an error sending the notification email:', err);
// 			}
// 		};
// 	}

// 	if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
// 		console.log('Unable to send email - no mailgun credentials provided');
// 		return callback(new Error('could not find mailgun credentials'));
// 	}

// 	var enquiry = this;
// 	var brand = keystone.get('brand');

// 	keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {
// 		if (err) return callback(err);
// 		new keystone.Email({
// 			templateName: 'enquiry-notification',
// 			transport: 'mailgun',
// 		}).send({
// 			to: admins,
// 			from: {
// 				name: 'Crampa Holds',
// 				email: 'contact@crampaclimb.com',
// 			},
// 			subject: 'New Enquiry for Crampa Holds',
// 			enquiry: enquiry,
// 			brand: brand,
// 			layout: false,
// 		}, callback);
// 	});
// };

Order.schema.pre('save', function (next) {
	// TODO: send email notification & SMS notification
	next();
});

Order.defaultSort = '-createdAt';
Order.defaultColumns = 'createdAt, user';
Order.register();
