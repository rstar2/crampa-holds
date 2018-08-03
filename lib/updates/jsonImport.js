const fs = require('fs');
const readline = require('readline');

const typeRegexes = [
	/{\s*"\$oid"\s*:\s*"(\S+)"\s*}/gm,
	/{\s*"\$date"\s*:\s*"(\S+)"\s*}/gm,
];
const typeRegexReplace = '"$1"';

/**
 * Strips/removes all "MongoDb types" from the document JSON string,
 * making it valid JSON string to be imported by Mongoose
 * @param {String} document
 * @returns {String} always valid
 */
const removeTypes = (document) => {
	// we have to replace all MongoDB typed constructs of the sort
	// '{ "$oid" : "5a8c34bea71cd015dcda1a03" }',
	// '{ "$date" : "2018-03-10T22:00:00.000+0000" }', ...
	// with just the ID/Date (e.g. matched value) inside '"5a8c34bea71cd015dcda1a03"'

	typeRegexes.forEach(regex => {
		document = document.replace(regex, typeRegexReplace);
	});
	return document;
};


/**
 * Read and parse a JSON exported collected/documents using 'mongoexport'.
 * The documents must NOT be comma separated, e.g each document should be one on it line and
 * is not associated/connected with the other lines.
 * Technically this is NOT a valid JSON formatted file.
 * The returned data in the promise is ready to be inserted by Mongoose Model:
 * Example:
 * const User = ...; // Mongoose Model
 * parseDataFile(...).then(users => User.insertMany(users));
 *
 * @param {String} dataFile
 * @returns {Promise<[]>} promise with all validly parsed documents
 */
const parseDataFile = (dataFile) => {
	return new Promise((resolve, reject) => {
		const lines = [];
		const rl = readline.createInterface({ input: fs.createReadStream(dataFile) });
		rl.on('line', (line) => {
			const data = JSON.parse(removeTypes(line));
			lines.push(data);
		});
		rl.on('close', () => resolve(lines));
	});
};

module.exports = {
	removeTypes,
	parseDataFile,
};
