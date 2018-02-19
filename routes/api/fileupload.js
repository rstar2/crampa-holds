const keystone = require('keystone');
const exec = require('child_process').exec;


/**
 * This is en example API route handler
 */

const FileUpload = keystone.list('FileUpload');

/**
 * List Files
 */
exports.list = function (req, res) {
	FileUpload.model.find(function (err, items) {
		if (err) return res.apiError('database error', err);

		res.apiResponse({
			collections: items,
		});

	});
};

/**
 * Get File by ID
 */
exports.get = function (req, res) {
	FileUpload.model.findById(req.params.id).exec(function (err, item) {
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		res.apiResponse({
			collection: item,
		});
	});
};


/**
 * Update File by ID
 */
exports.update = function (req, res) {
	FileUpload.model.findById(req.params.id).exec(function (err, item) {
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		const data = (req.method === 'POST') ? req.body : req.query;

		item.getUpdateHandler(req).process(data, function (err) {
			if (err) return res.apiError('create error', err);

			res.apiResponse({
				collection: item,
			});
		});
	});
};

/**
 * Upload a New File
 */
exports.create = function (req, res) {
	const newItem = new FileUpload.model();
	const data = (req.method === 'POST') ? req.body : req.query;

	newItem.getUpdateHandler(req).process(req.files, function (err) {

		if (err) return res.apiError('error', err);

		res.apiResponse({
			file_upload: newItem,
		});

	});
};

/**
 * Delete File by ID
 */
exports.remove = function (req, res) {
	const fileId = req.params.id;
	FileUpload.model.findById(fileId).exec(function (err, item) {
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		item.remove(function (err) {
			if (err) return res.apiError('database error', err);

			// Delete the file
			exec('rm public/uploads/files/' + fileId + '.*', function (err, stdout, stderr) {
				if (err) {
					console.log('child process exited with error code ' + err.code);
					return;
				}
				console.log(stdout);
			});

			return res.apiResponse({
				success: true,
			});
		});

	});
};
