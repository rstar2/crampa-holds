const async = require('async');
const debug = require('debug')('app:db:Product');

const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Product Model
 * ==========
 */

const Product = new keystone.List('Product', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Product.add({
	title: { type: String, required: true },
	price: { type: Number, required: true, initial: true, default: 0 },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' }, default: Date.now },
	image: { type: String },
	description: {
		brief: { type: Types.Markdown, wysiwyg: true, height: 150 },
		extended: { type: Types.Markdown, wysiwyg: true, height: 400 },
	},
	categories: { type: Types.Relationship, ref: 'ProductCategory', many: true },
	quantity: { type: Number },
	canBeBought: { type: Boolean, default: true },
	parentProduct: {
		type: Types.Relationship, ref: 'Product',

		// NOTE: there's a bug in Keystone now that Mongo filters of the sort { $ne: 9 } doesn't work
		// filters: { price: 9 },
		// filters: { price: { $ne: 9 })},
		// filters: { price: JSON.stringify({ $ne: 9 }) },
		// filters: { id: '5b6d3b1eec92cc05fc62ad90' },
		// filters: { id: { $ne: "5b6d3b1eec92cc05fc62ad90" } },
	},
});
// Product.relationship({ ref: 'Product', path: 'subProducts', refPath: 'parentProduct' });

Product.schema.virtual('description.full').get(function () {
	return this.description.extended ? this.description.extended : this.description.brief;
});

Product.schema.methods.isPublished = function () {
	return this.state === 'published';
};

Product.schema.methods.isAbstract = function () {
	return !!this.price;
};

Product.schema.methods.getSubProducts = function (callback) {
	Product.model.find().where('parentProduct', this).exec(callback);
};

Product.schema.methods.getSubProductsAll = function (callback) {
	function getChildren (product, iter, done) {
		Product.model.find().where('parentProduct', product).exec((err, children) => {
			if (err) return done(err);

			if (children && children.length) {
				iter(children);
				async.each(children, (child, next) => getChildren(child, iter, next), done);
			} else {
				done();
			}
		});
	}

	const allChildren = [];
	getChildren(this,
		(children) => allChildren.push(...children),
		(err) => {
			debug(`Failed to get all sub-products for product ${this.id} - ${this.title} - \n${err}`);
			callback(err, allChildren);
		});
};

// Product.schema.pre('save', function (next) {
// 	if (this.isModified('state') && this.isPublished() && !this.publishedAt) {
// 		this.publishedAt = new Date();
// 	}
// 	next();
// });

Product.defaultSort = '-publishedDate';
Product.defaultColumns = 'title, state, price, canBeBought, publishedDate';
Product.register();
