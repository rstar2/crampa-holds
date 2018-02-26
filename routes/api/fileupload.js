const path = require('path');
const fs = require('fs');

const keystone = require('keystone');


/**
 * This is en example API route handler
 */

const FileUpload = keystone.list('FileUpload');

const router = keystone.createRouter(); // shorthand for require('express').Router

// API File Upload Route
router.get('/list', list);
router.get('/:id', get);
router.get('/:id/remove', remove);
router.all('/:id/update', update);
router.post('/create', create);

// TODO: use restify - to make it real REST

module.exports = router;

function toJSON (item) {
	return { ...item.toJSON(), id: item.id };
}

/**
 * List Files
 */
function list (req, res) {
	FileUpload.model.find(function (err, items) {
		if (err) return res.apiError('database error', err);

		res.apiResponse({ items: items.map(item => toJSON(item)) });
	});
}

/**
 * Get File by ID
 */
function get (req, res) {
	FileUpload.model.findById(req.params.id).exec(function (err, item) {
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		res.apiResponse({ item });
	});
}


/**
 * Upload a New File
 */
function create (req, res) {
	const item = new FileUpload.model();
	const data = (req.method === 'POST') ? req.body : req.query;

	item.getUpdateHandler(req).process(data, function (err) {
		if (err) return res.apiError('error', err);

		res.apiResponse({ item: toJSON(item) });
	});
}

/**
 * Update File by ID
 */
function update (req, res) {
	FileUpload.model.findById(req.params.id).exec(function (err, item) {
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		const data = (req.method === 'POST') ? req.body : req.query;

		item.getUpdateHandler(req).process(data, function (err) {
			if (err) return res.apiError('create error', err);

			res.apiResponse({ item });
		});
	});
}

/**
 * Delete File by ID
 */
function remove (req, res) {
	const fileId = req.params.id;
	FileUpload.model.findById(fileId).exec(function (err, item) {
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		item.remove(function (err) {
			if (err) return res.apiError('database error', err);

			// Delete the file from the file system
			const pathToRemove = path.join(item.file.path, item.file.filename);
			fs.unlink(pathToRemove, function (err) {
				if (err) {
					console.error('Failed to remove file ' + pathToRemove);
				}
			});

			res.apiResponse({
				success: true,
			});
		});
	});
}
