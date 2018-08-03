
const path = require('path');

const keystone = require('keystone');

const { parseDataFile } = require('../lib/updates/jsonImport');


const ProductCategory = keystone.list('ProductCategory');
const Product = keystone.list('Product');

module.exports = async function (done) {
	try {
		const productCategoriesData = await parseDataFile(path.resolve(__dirname, '0.0.2-data-productcategories.json'));
		await ProductCategory.model.insertMany(productCategoriesData);

		const productsData = await parseDataFile(path.resolve(__dirname, '0.0.2-data-products.json'));
		await Product.model.insertMany(productsData);
		done();
	} catch (error) {
		done(error);
	}
};
// this __defer__ property will defer/skip this update
// module.exports.__defer__ = true;
