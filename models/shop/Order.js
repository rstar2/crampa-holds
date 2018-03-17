const keystone = require('keystone');
const Types = keystone.Field.Types;

const { sendNotificationsForOrder } = require('../../lib/notify');

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

Order.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Order.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotifications();
	}
});

Order.schema.methods.sendNotifications = function (callback) {
	sendNotificationsForOrder(keystone, this, ['email', 'sms'], callback);
};

Order.defaultSort = '-createdAt';
Order.defaultColumns = 'createdAt, user';
Order.register();
