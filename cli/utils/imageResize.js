const os = require('os');

const sharp = require('sharp');
const async = require('async');

const { getExtension } = require('./fs');

const addQuality = (params, quality) => {
	return { ...params, quality };
};

/**
 * @param {Sharp} sharp
 * @param {String} extension
 * @param {Number} quality
 */
const format = (sharp, extension, quality) => {
	// use high quality for JPEG
	let method;
	let params = {};
	switch (extension) {
		case 'jpeg':
		case 'jpg':
			method = 'jpeg';
			params = { chromaSubsampling: '4:4:4' };
			break;
		case 'png':
			method = 'png';
			break;
		default:
			throw new Error(`Unsupported image format for resizing : ${extension}`);
	}
	params = addQuality(params, quality);

	console.log(params)
	return sharp[method].call(sharp, params);
};

/**
 * @param {String} input
 * @param {String} outputPattern
 * @param {[ [Number, Number] ]} sizes
 * @param {Number} [quality]
 */
exports.resize = (input, outputPattern, sizes, quality = 80) => {
	const extension = getExtension(input, true).toLowerCase();

	let pipeline = sharp(input);
	pipeline = format(pipeline, extension, quality);

	async.eachLimit(sizes, os.cpus().length,
		(size, next) => {
			const output = outputPattern.replace(/%size%/g, `${size.join('x')}`);
			console.log(`Resize ${input} to ${size.join('x')}`);
			pipeline
				.resize(...size)
				.sharpen()
				.toFile(output, function (err) {
					if (err) console.error(`Failed to resize ${input} to ${size.join('x')} : ${err}`);

					console.log(`Successfully resized ${input} to ${size.join('x')}`);
					next();
				});
		},
		(err) => {
			if (err) console.error(`Failed to resize ${input} : ${err}`);
		});
};


