const keystone = require('keystone');

module.exports = function (done) {
	const importPromises = importData
		.map(({ name, category }) => createPost({ name, category }));

	Promise.all(importPromises)
		.then(() => done())
		.catch(error => done(error));
};
// this __defer__ prop will defer/skip this update
module.exports.__defer__ = true;

const ProductCategory = keystone.list('PostCategory');
const Product = keystone.list('Post');

const importData = [
	{ name: 'A draft product 1', category: 'Temporary 1' },
	{ name: 'A draft product 2', category: 'Temporary 2' },
	{ name: 'A draft product 3', category: 'Temporary 1' },
];


const categories = {};

const createPost = ({ name, category }) => {
	let productCategory;
	if (categories[category]) {
		productCategory = categories[category];
	} else {
		productCategory = new ProductCategory.model({ category });
		categories[category] = productCategory;
	}

	const product = new Product.model({ name });
	product.category = productCategory._id.toString();

	// save both (no matter any more the sequence , no matter that)
	return Promise.all([
		product.save(),
		productCategory.save(),
	]);
}
