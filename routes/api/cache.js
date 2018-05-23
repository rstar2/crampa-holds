const keystone = require('keystone');

const router = keystone.createRouter(); // shorthand for require('express').Router

// API File Upload Route
router.get('/render/list', renderList);
router.post('/render/purge', renderPurge);
router.post('/render/get', renderGet);
router.post('/render/delete', renderDelete);


const cache = keystone.cache;

module.exports = router;

/**
 * Get all cached "render" keys:
 */
function renderList (req, res) {
	cache.render.list((error, keys) => {
		if (error) return res.apiError(error);

		res.apiResponse({ keys });
	});
}

/**
 * Purge all cached "render" keys:
 */
function renderPurge (req, res) {
	cache.render.purge((error) => {
		if (error) return res.apiError(error);

		res.apiResponse({});
	});
}

/**
 * Get a single cached "render" key value:
 */
function renderGet (req, res) {
	cache.render.get(req.body.key, (error, value) => {
		if (error) return res.apiError(error);

		res.apiResponse({ value });
	});
}

/**
 * Remove all (or specified) cached "render" keys
 */
function renderDelete (req, res) {
	cache.render.del(req.body.key, (error, count) => {
		if (error) return res.apiError(error);

		res.apiResponse({ count });
	});
}
