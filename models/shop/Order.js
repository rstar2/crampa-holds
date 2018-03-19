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
	user: { type: Types.Relationship, ref: 'User', required: true, index: true },
	zone: { type: Number, required: true },
	shippingAddress: { type: String, required: true },
	billingAddress: { type: String },
	additionalInfo: { type: String },
	createdAt: { type: Date, default: Date.now },
	paymentId: { type: String, required: true },
	paymentProvider: { type: String, required: true },
});
// add this arbitrary 'cart' schema directly to the Mongoose model,
// the Keystone model doesn't support this yet
Order.schema.add({
	products: [{
		id: String,
		quantity: Number,
	}],
	totalPrice: { type: Number },
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
