const keystone = require('keystone');
const Types = keystone.Field.Types;

const { sendNotificationsForEnquiry } = require('../lib/notify');

/**
 * Enquiry Model
 * =============
 */

const Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
	noedit: true,
});

Enquiry.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	message: { type: Types.Markdown, required: true },
	subject: {
		type: Types.Select, options: [
			{ value: 'message', label: 'Just leaving a message' },
			{ value: 'order', label: `Order related` },
			{ value: 'other', label: 'Something else...' },
		],
	},
	phone: { type: String },
	createdAt: { type: Date, default: Date.now },
});

Enquiry.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Enquiry.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Enquiry.schema.methods.sendNotificationEmail = function (callback) {
	sendNotificationsForEnquiry(keystone, this, ['email'], callback);
};

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, subject, createdAt';
Enquiry.register();
