const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * ShippingZone Model
 * =============
 */

const ShippingZone = new keystone.List('ShippingZone', {
});

ShippingZone.add({
	name: { type: Types.Key, required: true, index: true, unique: true },
	description: { type: Types.Textarea },
	shipping: { type: Number, required: true, default: 0 },
	tax: { type: Number, default: 0 },
});
ShippingZone.schema.add({
	countries: [String],
	// the same as:
	// countries: [{ type: String }],
});

ShippingZone.register();
