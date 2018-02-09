var keystone = require('keystone');

/**
 * ProductCategory Model
 * ==================
 */

var ProductCategory = new keystone.List('ProductCategory', {
	autokey: { path: 'slug', from: 'name', unique: true },
});

ProductCategory.add({
	name: { type: String, required: true },
});

ProductCategory.relationship({ ref: 'Product', path: 'products', refPath: 'categories' });

ProductCategory.register();
