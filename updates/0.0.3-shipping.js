
const path = require('path');

const keystone = require('keystone');

/*
<ul>
	<li>Zone 1 - Germany, Austria and Hungary - 15 €</li>
	<li>Zone 2 - Croatia (local name: Hrvatska), Denmark, Luxembourg, Poland, Slovakia (Slovak Republic), Slovenia - 28 €</li>
	<li>Zone 3 - Belgium, Czech Republic, France, Italy, Netherlands, United Kingdom - 21 €</li>
	<li>Zone 4 - Estonia, Finland, Ireland, Latvia, Lithuania, Portugal, Sweden - 39 €</li>
	<li>Zone 5 - Spain - 28 €</li>
	<li>Zone 6 - Greece, Romania - 7 €</li>
	<li>Zone 7 - Macedonia - 15 €</li>
</ul>
*/

const zones = [
	{
		name: 'BG',
		shipping: 0,
		countries: ['BG'],
		description: 'Bulgaria',
	},
	{
		name: 'Zone 1',
		shipping: 15,
		countries: ['DE', 'AT', 'HU'],
		description: 'Germany, Austria, Hungary',
	},
	{
		name: 'Zone 2',
		shipping: 15,
		countries: ['HR', 'DK', 'LU', 'PL', 'SK', 'SI'],
		description: 'Croatia, Denmark, Luxembourg, Poland, Slovakia, Slovenia',
	},
	{
		name: 'Zone 3',
		shipping: 21,
		countries: ['BE', 'CZ', 'FR', 'IT', 'LU', 'NL', 'UK'],
		description: 'Belgium, Czech Republic, France, Italy, Netherlands, United Kingdom',
	},
	{
		name: 'Zone 4',
		shipping: 39,
		countries: ['EE', 'FI', 'IE', 'LV', 'LT', 'PT', 'SE'],
		description: 'Estonia, Finland, Ireland, Latvia, Lithuania, Portugal, Sweden',
	},
	{
		name: 'Zone 5',
		shipping: 28,
		countries: ['ES'],
		description: 'Spain',
	},\
	{
		name: 'Zone 6',
		shipping: 7,
		countries: ['GR', 'RO'],
		description: 'Greece, Romania',
	},
	{
		name: 'Zone 7',
		shipping: 15,
		countries: ['MK'],
		description: 'Macedonia',
	},
];

exports.create = {
	ShippingZone: zones,
};

// this __defer__ property will defer/skip this update
// module.exports.__defer__ = true;
