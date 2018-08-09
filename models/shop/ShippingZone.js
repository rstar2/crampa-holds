const keystone = require('keystone');
const Types = keystone.Field.Types;

const countryMap = require('../../lib/utils/countries');

/**
 * ShippingZone Model
 * =============
 */

const ShippingZone = new keystone.List('ShippingZone', {
	autokey: { path: 'key', from: 'name', unique: true },
});

ShippingZone.add({
	name: { type: String, required: true, unique: true },
	shipping: { type: Types.Number, required: true, initial: true },
	description: { type: Types.Textarea },
	tax: { type: Types.Number, default: 0 },
});

// currently KeystoneJS dont' have multiselect - which would be the best solution
// ShippingZone.add({
// 	countries: {
// 		type: Types.Select,
// 		// emptyOption: false, // will allow empty selection value - this will be the "All-Others" counties

// 		// countries is arrays of type [{'name': 'Bulgaria', 'code': 'BG'}, ...] so have to map it to {value, label}
// 		options: countryMap.map(country => ({ value: country.code, label: country.name })),
// 	},
// });

// this will allow adding multiple values - unfortunately no predefined and will no 'label' like using a multiselect
ShippingZone.add({
	countries: { type: Types.TextArray },
});

// ShippingZone.schema.add({
// 	countries: [String],
// 	// the same as:
// 	// countries: [{ type: String }],
// });

ShippingZone.schema.pre('save', function (next) {
	if (!this.description) {
		this.description = this.countries
			.map(code => {
				const country = countryMap.find(country => country.code === code);
				return country && country.name;
			})
			.filter(name => !!name)
			.join(', ');
	}
	next();
});

ShippingZone.defaultSort = 'shipping';
ShippingZone.defaultColumns = 'name, shipping';
ShippingZone.register();
