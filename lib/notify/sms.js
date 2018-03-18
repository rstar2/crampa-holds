const twilio = require('twilio');

// Your Account SID from www.twilio.com/console
const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
// Your Auth Token from www.twilio.com/console
const authToken = 'your_auth_token';


const client = new twilio(accountSid, authToken);


exports.sendFor = function (keystone, subjectType, subject, callback) {
	if (!process.env.TWILIO_API_KEY
		|| !process.env.TWILIO_API_SECRET
		|| !process.env.NOTIFY_SMS_SENDER) {
		console.log('Unable to send SMS - no Twilio credentials provided');
		return callback(new Error('could not find Mailgun credentials'));
	}

	// get the admins' phones
	keystone.list('User').model.find()
		.where('isAdmin', true)
		.where('phone').exists()
		.select('phone')
		.exec(function (err, adminPhones) {
			if (err) return callback(err);

			// iterate through all phones
			// TODO: use async - and one final callbacks
			adminPhones.forEach((to) => {
				send(keystone, {
					to, templateName: subjectType, locals: { [subjectType]: subject },
				}, callback);
			});
		});
};

function send (keystone, { to, templateName, locals = {} }, callback) {
	const brand = keystone.get('brand');

	// new keystone.Email({
	// 	templateName,
	// 	transport: 'mailgun',
	// }).send({
	// 	to,
	// 	subject: `New Enquiry for ${brand}`,
	// 	from: { // this is the MAILGUN (or other transport) sending user
	// 		name: brand,
	// 		email: process.env.NOTIFY_EMAIL_SENDER,
	// 	},

	// 	// these are locals for the template
	// 	...locals,
	// 	brand,

	// 	// this is whether the template should use a layout
	// 	layout: false,
	// }, callback);

	client.messages.create({
		body: `New ${templateName} for ${brand}`,
		to,   // Text this number
		from: process.env.NOTIFY_SMS_SENDER, // From a valid Twilio number
	})
		.then((message) => {
			console.log(`Successfully sent SMS to ${to}`);
			callback(null);
		})
		.catch((err) => callback(err));
}


