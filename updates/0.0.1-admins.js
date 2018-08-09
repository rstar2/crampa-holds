/**
 * This script automatically creates a default Admin user when an
 * empty database is used for the first time. You can use this
 * technique to insert data into any List you have defined.
 *
 * Alternatively, you can export a custom function for the update:
 * module.exports = function(done) { ... }
 */

const admins = [
	{
		'isAdmin': true,
		'password': process.env.FIRST_ADMIN_PASSWORD,
		'email': process.env.FIRST_ADMIN_EMAIL,

		// possible name keys:
		// 1:
		// name: {
		// 	first: 'First',
		// 	last: 'Last',
		// },
		// 2:
		// 'name.first': 'First',
		// 'name.last': 'Last',
		// 3:
		'name.full': process.env.FIRST_ADMIN_NAME,
	},
];

// var admins = [
// 	{ email: 'user@keystonejs.com', password: 'admin', name: { first: 'Admin', last: 'User' } }
// ];
exports.create = {
	User: admins,
};

/*

// This is the long-hand version of the functionality above:

const keystone = require('keystone');
const async = require('async');
const User = keystone.list('User');
function createAdmin (admin, done) {

	const newAdmin = new User.model(admin);

	newAdmin.isAdmin = true;
	newAdmin.save(function (err) {
		if (err) {
			console.error('Error adding admin ' + admin.email + ' to the database:');
			console.error(err);
		} else {
			console.log('Added admin ' + admin.email + ' to the database.');
		}
		done(err);
	});

}

exports = module.exports = function (done) {
	async.forEach(admins, createAdmin, done);
};

*/
