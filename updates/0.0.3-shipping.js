
const path = require('path');

const keystone = require('keystone');

const { parseDataFile } = require('../lib/updates/jsonImport');


const ShippingZone = keystone.list('ShippingZone');

module.exports = async function (done) {
	try {
		const shippingZonesData = await parseDataFile(path.resolve(__dirname, '0.0.3-data-shippingzones.json'));
		await ShippingZone.model.insertMany(shippingZonesData);
		done();
	} catch (error) {
		done(error);
	}
};
// this __defer__ property will defer/skip this update
module.exports.__defer__ = true;
