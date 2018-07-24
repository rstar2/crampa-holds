const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Init locals
	locals.section = 'blog';

	// Load the posts
	view.on('init', function (next) {

		const q = keystone.list('Post').paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
			filters: {
				state: 'published',
			},
		})
			.sort('-publishedDate')
			.populate('author');

		q.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});
	});

	// Render the view - allowing response to be cache (with or without expiration)
	view.render('blog', null, res.cache);
	// view.render('blog', null, res.cacheExpire(5));
};
