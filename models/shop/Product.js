const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Product Model
 * ==========
 */

const Product = new keystone.List('Product', {
	autokey: { path: 'slug', from: 'name', unique: true },
});

Product.add({
	name: { type: String, required: true },
	price: { type: Number, required: true, initial: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' }, default: Date.now },
	image: { type: Types.CloudinaryImage },
	description: { type: Types.Markdown, wysiwyg: true, height: 150 },
	categories: { type: Types.Relationship, ref: 'ProductCategory', many: true },
	quantity: { type: Number },
	canBeBought: { type: Boolean, default: true },
});

Product.schema.methods.isPublished = function () {
	return this.state === 'published';
};

// Product.schema.pre('save', function (next) {
// 	if (this.isModified('state') && this.isPublished() && !this.publishedAt) {
// 		this.publishedAt = new Date();
// 	}
// 	next();
// });

Product.defaultSort = '-publishedDate';
Product.defaultColumns = 'name, state, publishedDate, canBeBought';
Product.register();
