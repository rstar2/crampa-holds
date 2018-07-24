const fs = require('fs');

const keystone = require('keystone');

let gallery = // fs.readdirSync(keystone.root('/uploads/files'));
	[
		'_5gcHqKDy9DAOzKz.JPG',
		'KCIhlWZ7youOOEWd.JPG',
		'PS4RB7_2IbU9L7pw.JPG',
	];

gallery = gallery.map(file => ({ url: `/uploads/files/${file}` }));


exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'gallery';
	locals.images = gallery;

	// Render the view
	view.render('gallery', null, res.cache);

};
