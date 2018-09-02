const url = require('url');
const crawlerUserAgents = require('./crawlers');

// From prerender.io -> https://github.com/prerender/prerender-node

/**
 * Check if the HTTP request is from a "crawler" (searcj robot, bot, etc...)
 * 
 * @param {Request} req
 */
module.exports = function isCrawler (req) {
	let userAgent = req.headers['user-agent'];
	let bufferAgent = req.headers['x-bufferbot'];
	let isCrawler = false;

	if (!userAgent) return false;
	if (req.method !== 'GET' && req.method !== 'HEAD') return false;
	if (req.headers && req.headers['x-prerender']) return false;

	// if it is BufferBot - crawler
	if (bufferAgent) isCrawler = true;

	// if it contains _escaped_fragment_ - crawler
	let parsedQuery = url.parse(req.url, true).query;
	if (parsedQuery && parsedQuery._escaped_fragment_ !== undefined) isCrawler = true;

	// if it is a bot - crawler
	if (crawlerUserAgents.some(crawlerUserAgent => userAgent.toLowerCase().indexOf(crawlerUserAgent.toLowerCase()) !== -1)) isCrawler = true;


	return isCrawler;
};
