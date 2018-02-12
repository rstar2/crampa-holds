var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Gallery Model
 * =============
 */

var Gallery = new keystone.List('Gallery', {
	autokey: { path: 'slug', from: 'name', unique: true },

	// This adds a hidden field to the schema which is sortOrder, which is a number.
	// Keystone updates the sortOrder whenever an item is dragged in the admin UI,
	// changing all necessary items to correct the sortOrder.
	sortable: true,
});

Gallery.add({
	name: { type: String, required: true },
	publishedDate: { type: Date, default: Date.now },
	heroImage: { type: Types.CloudinaryImage },
	images: { type: Types.CloudinaryImages },
});

Gallery.register();
