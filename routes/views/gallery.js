const fs = require('fs');
const path = require('path');

const keystone = require('keystone');

const galleryFolder = '/uploads/gallery/main';
const galleryPath = path.join(keystone.get('module root'), galleryFolder);
let gallery = fs.readdirSync(galleryPath).filter(name => {
	const info = fs.statSync(path.join(galleryPath, name));
	return info.isFile();
});

gallery = gallery.map(file => ({ url: `${galleryFolder}/${file}` }));


exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'gallery';
	locals.images = gallery;

	// Render the view
	view.render('gallery', null, res.cache);

};
