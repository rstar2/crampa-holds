const galleries = {};

const createGallery = require('./createGallery');

/**
 * Gets a registered gallery for given slug and folder,
 * if not already  created the gallery is first created.
 *
 * @param {Keystone} keystone
 * @param {String} galleryFolder
 * @param {String} [slug] if not set use the galleryFolder as slug
 * @returns {{images: [], videos: []} gallery with images and videos
 */
function getGallery (keystone, galleryFolder, slug) {
	if (!slug) slug = galleryFolder;

	let gallery = galleries[slug];
	if (!gallery) {
		gallery = createGallery(keystone, galleryFolder);
		galleries[slug] = gallery;
	}


	return gallery;
}

module.exports = getGallery;
