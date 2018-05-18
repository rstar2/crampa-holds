const keystone = require('keystone');

const router = keystone.createRouter(); // shorthand for require('express').Router

// API File Upload Route
router.get('/render/keys', renderKeys);
router.post('/render/get', renderGet);
router.post('/render/remove', renderRemove);

module.exports = router;

/**
 * Get all cached "render" keys:
 */
function renderKeys (req, res) {
	res.apiResponse({});
}

/**
 * Get a single cached "render" key value:
 */
function renderGet (req, res) {
	res.apiResponse({});
}

/**
 * Remove all (or specified) cached "render" keys
 */
function renderRemove (req, res) {
	res.apiResponse({});
}
