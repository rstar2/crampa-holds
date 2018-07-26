const fs = require('fs');
const path = require('path');

const galleryRoot = '/uploads/gallery';

const videoExtensions = [
	'mp4',
	'mov',
];

/**
 * Creates a gallery from given folder.
 *
 * @param {Keystone} keystone
 * @param {String} galleryFolder
 * @returns {{images: [], videos: []} gallery with images and videos
 */
function createGallery (keystone, galleryFolder) {
	const galleryPathPublic = path.join(galleryRoot, galleryFolder);
	const galleryPath = path.join(keystone.get('module root'), galleryPathPublic);

	let gallery = fs.readdirSync(galleryPath).filter(name => {
		const info = fs.statSync(path.join(galleryPath, name));
		return info.isFile();
	});

	gallery = gallery.reduce((acc, file) => {
		const ext = path.extname(file).toLowerCase();
		let array = acc.images;
		if (videoExtensions.includes(ext)) {
			array = acc.videos;
		}
		array.push({ url: `${galleryPathPublic}/${file}` });
		return acc;

	}, { images: [], videos: [] });

	return gallery;
}

module.exports = createGallery;
