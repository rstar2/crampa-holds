const path = require('path');
const fs = require('fs');

const { resize } = require('./utils/imageResize');
const { mkdirSync, getExtension, getFileName } = require('./utils/fs');

const input = process.argv[2];
if (!fs.existsSync(input)) {
	console.error(`Input file ${input} doesn't exists`);
	process.exit(1);
}

let quality = process.argv[3];
if (quality) {
	// convert String to Number
	quality = +quality;
}

const extension = getExtension(input);
const fileName = getFileName(input);
const outputDir = path.resolve(__dirname, '..', 'uploads/images/thumbs/sharp');
mkdirSync(outputDir);


const sizes = [[null, 150], [null, 500]];
const output = path.join(outputDir, `${fileName}-%size%${extension}`);

resize(input, output, sizes, quality);
