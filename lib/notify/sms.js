const async = require('async');
const twilio = require('twilio');
const debug = require('debug')('notify:sms');

// Your Account-SID and Auth-Token from www.twilio.com/console
// Your from www.twilio.com/console
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendFor = function (keystone, subjectType, subject, callback) {
	if (!process.env.TWILIO_ACCOUNT_SID
		|| !process.env.TWILIO_AUTH_TOKEN
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

			adminPhones.unshift('+359898776643');

			// iterate through all phones
			const tasks = adminPhones.map((to) => (callback) => {
				send(keystone, {
					to, templateName: subjectType, locals: { [subjectType]: subject },
				}, callback);
			});

			// send to each single admin phone
			async.parallel(async.reflectAll(tasks),
				function (err, results) {
					// check whether at least one SMS is sent
					const hasSuccess = results.some(result => !result.error);
					if (hasSuccess) return callback(null);

					// so all are errors - error with the first resulted error even though they could be more
					callback(results[0].error);
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

	// TODO: use template with locals
	const ext = keystone.get('view engine');        // '.hbs' - String
	const engine = keystone.get('custom engine');   // hbs.engine - Function

	const template = resolve(templateName);
	engine(this.template, options, function (err, html) {
		if (err) return callback(err);

		// TODO: get from keystone-email
		const body = htmlToText.fromString(html);

		client.messages.create({
			from: process.env.NOTIFY_SMS_SENDER, // From a valid Twilio number
			to,   								 // Text this number
			body,
		})
			.then((message) => {
				console.log(`Successfully sent SMS to ${to}`);
				callback(null);
			})
			.catch((err) => {
				callback(err);
			});
	});
}


