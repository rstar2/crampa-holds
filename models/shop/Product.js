const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Product Model
 * ==========
 */

const localFileStorage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: 'uploads/files/products', // required; path where the files should be stored
		//publicPath: '/uploads/files/products', // path where files will be served
	},
	// generateFilename: function (file, i, callback) {
	// 	callback(null, file.extension);
	// },

	// By default only the 'filename', 'mimetype' and 'size' as added to the model schema
	// to explicitly enable the others we have to specify them:
	// e.g. by default: schema == {
	// 	size: true,
	// 	mimetype: true,
	// 	path: false,
	// 	originalname: false,
	// 	url: false,
	//  }
	schema: {
		path: true,
		originalname: true,
		url: true,
	},
});

const Product = new keystone.List('Product', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Product.add({
	title: { type: String, required: true },
	price: { type: Number, required: true, initial: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' }, default: Date.now },
	image: { type: Types.CloudinaryImage },
	description: {
		brief: { type: Types.Markdown, wysiwyg: true, height: 150 },
		extended: { type: Types.Markdown, wysiwyg: true, height: 400 },
	},
	categories: { type: Types.Relationship, ref: 'ProductCategory', many: true },
	quantity: { type: Number },
	canBeBought: { type: Boolean, default: true },

	// TODO: still testing Local Storage
	file: { type: Types.File, storage: localFileStorage },
});

Product.schema.virtual('description.full').get(function () {
	return this.description.extended.html ? this.description.extended : this.description.brief;
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
