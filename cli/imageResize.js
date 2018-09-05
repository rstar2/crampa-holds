const path = require('path');
const fs = require('fs');

const { resize } = require('./utils/imageResize');
const mkdirSync = require('./utils/mkdirRecursive');

const input = process.argv[2];
if (!fs.existsSync(input)) {
	console.error(`Input file ${input} doesn't exists`);
	process.exit(1);
}

const extension = path.extname(input);
const fileName = path.basename(input).replace(extension, '');

const outputDir = path.resolve(__dirname, '..', 'uploads/images/thumbs/sharp/ad/asd');
mkdirSync(outputDir);


const size = [200, 200];
const output = path.join(outputDir, `${fileName} - ${size.join('x')}${extension}`);

resize(input, output, size);
