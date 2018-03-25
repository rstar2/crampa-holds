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
	track: true,
});

Order.Status = {
	CREATED: 'created',
	PAID: 'paid',
	SHIPPED: 'shipped',
	COMPLETED: 'completed',
};

Order.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, required: true, unique: true, index: true },

	shippingZone: { type: Types.Relationship, ref: 'ShippingZone', required: true },
	shippingAddress: { type: String, required: true },
	billingAddress: { type: String },
	additionalInfo: { type: String },

	status: {
		type: Types.Select, options: Object.keys(Order.Status).map(key => Order.Status[key]),
		default: Order.Status.CREATED,
	},
	totalPrice: { type: Number },

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
});
// add this 'payment' - arbitrary data depending on the provider (for PayPal it can be one schema, for Stripe - different)
// this is just for reference, not to go to the provider's DB and check it from there when needed
Order.schema.add({
	payment: { type: Object },
});

Order.schema.post('save', function () {
	if (this.status === Order.Status.PAID) {
		this.sendNotifications();
	}
});

Order.schema.methods.sendNotifications = function (callback) {
	sendNotificationsForOrder(keystone, this, ['email', 'sms'], callback);
};

Order.defaultSort = '-createdAt';
Order.defaultColumns = 'createdAt, name, email';
Order.register();
