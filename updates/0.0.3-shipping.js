
const zones = [
	{
		name: 'BG',
		shipping: 0,
		countries: ['BG'],
	},
	{
		name: 'Zone 1',
		shipping: 15,
		countries: ['DE', 'AT', 'HU'],

		// Note the description will be dynamically created from the country codes
		// description: 'Germany, Austria, Hungary',
	},
	{
		name: 'Zone 2',
		shipping: 15,
		countries: ['HR', 'DK', 'LU', 'PL', 'SK', 'SI'],
	},
	{
		name: 'Zone 3',
		shipping: 21,
		countries: ['BE', 'CZ', 'FR', 'IT', 'LU', 'NL', 'UK'],
	},
	{
		name: 'Zone 4',
		shipping: 39,
		countries: ['EE', 'FI', 'IE', 'LV', 'LT', 'PT', 'SE'],
	},
	{
		name: 'Zone 5',
		shipping: 28,
		countries: ['ES'],
	},
	{
		name: 'Zone 6',
		shipping: 7,
		countries: ['GR', 'RO'],
	},
	{
		name: 'Zone 7',
		shipping: 15,
		countries: ['MK'],
		// the mapped name is 'The Former Republic of Macedonia' so explicitly set it
		description: 'Macedonia',
	},
];

exports.create = {
	ShippingZone: zones,
};

// this __defer__ property will defer/skip this update
// module.exports.__defer__ = true;
