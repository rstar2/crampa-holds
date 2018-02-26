const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// use the Admin layout
	locals.layout = 'admin';

	// Render the view
	view.render('admin/fileupload');
};
