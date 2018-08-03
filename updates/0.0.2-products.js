
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const keystone = require('keystone');

const readData = (dataFile) => {
	return new Promise((resolve, reject) => {
		const data = [];
		const rl = readline.createInterface({ input: fs.createReadStream(dataFile) });
		rl.on('line', (line) => {
			line = JSON.parse(line);
			data.push({ ...line, _id: line._id.$oid });
		});
		rl.on('close', () => resolve(data));
	});
};

const ProductCategory = keystone.list('ProductCategory');
const Product = keystone.list('Product');

module.exports = async function (done) {
	try {
		const productsCategoriesData = await readData(path.resolve(__dirname, '0.0.2-data-productcategories.json'));
		await ProductCategory.model.insertMany(productsCategoriesData);

		const productsData = await readData(path.resolve(__dirname, '0.0.2-data-products.json'));
		await Product.model.insertMany(productsData);
		done();
	} catch (error) {
		done(error);
	}
};
// this __defer__ prop will defer/skip this update
module.exports.__defer__ = true;
