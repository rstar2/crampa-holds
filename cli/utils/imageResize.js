const sharp = require('sharp');

// const transformer = sharp()
// 	.resize(200, 200)
// 	.crop(sharp.strategy.entropy)
// 	.on('error', function (err) {
// 		console.log(err);
// 	});
// // Read image data from readableStream
// // Write 200px square auto-cropped image data to writableStream
// readableStream.pipe(transformer).pipe(writableStream);

/**
 * @param {String} input
 * @param {String} output
 * @param {Number[]} size
 */
exports.resize = (input, output, size) => {
	sharp(input)
		.resize(...size)
		.toFile(output, function (err) {
			if (err) console.error(`Failed to resize ${input} : ${err}`);

			console.log(`Successfully resized ${input}`);
		});
};


