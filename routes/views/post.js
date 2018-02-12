var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post,
	};
	locals.data = {
		posts: [],
	};

	// Load the current post
	view.on('init', function (next) {

		keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post,
		})
			.populate('author categories')
			.exec(function (err, result) {
				locals.data.post = result;
				next(err);
			});

	});

	// Load other posts
	view.on('init', function (next) {

		keystone.list('Post').model.find()
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author')
			.limit('4')
			.exec(function (err, results) {
				locals.data.posts = results;
				next(err);
			});

	});

	// Comments

	// Load comments on the Post
	view.on('init', function (next) {
		keystone.list('PostComment').model.find()
			.where('post', locals.data.post)
			.where('commentState', 'published')
			.where('author').ne(null)
			.populate('author', 'name photo')
			.sort('-publishedOn')
			.exec(function (err, comments) {
				if (err) return res.err(err);
				if (!comments) return res.notfound('Post comments not found');
				locals.data.comments = comments;
				next();
			});
	});

	// Create a Comment
	view.on('post', { action: 'comment.create' }, function (next) {

		if (!req.user) {
			req.flash('error', 'You must be signed in to create a comment.');
			return next();
		}

		// TODO: check this
		var newComment = new keystone.list('PostComment').model({
			state: 'published',
			post: locals.data.post.id,
			author: locals.user.id,
		});

		var updater = newComment.getUpdateHandler(req);

		updater.process(req.body, {
			fields: 'content',
			flashErrors: true,
			logErrors: true,
		}, function (err) {
			if (err) {
				validationErrors = err.errors;
			} else {
				req.flash('success', 'Your comment was added.');
				return res.redirect('/blog/post/' + locals.post.slug + '#comment-id-' + newComment.id);
			}
			next();
		});

	});

	// Delete a Comment
	view.on('get', { action: 'comment.remove' }, function (next) {

		if (!req.user) {
			req.flash('error', 'You must be signed in to delete a comment.');
			return next();
		}

		// TODO: check this
		keystone.list('PostComment').model.findOne({
			_id: req.query.comment,
			post: locals.data.post.id,
		})
			.exec(function (err, comment) {
				if (err) {
					if (err.name === 'CastError') {
						req.flash('error', 'The comment ' + req.query.comment + ' could not be found.');
						return next();
					}
					return res.err(err);
				}
				if (!comment) {
					req.flash('error', 'The comment ' + req.query.comment + ' could not be found.');
					return next();
				}
				if (comment.author !== req.user.id) {
					req.flash('error', 'Sorry, you must be the author of a comment to delete it.');
					return next();
				}

				// removed comments are actually "archived"
				comment.commentState = 'archived';
				comment.save(function (err) {
					if (err) return res.err(err);
					req.flash('success', 'Your comment has been deleted.');
					return res.redirect('/blog/post/' + locals.post.slug);
				});
			});
	});


	// Render the view
	view.render('post');
};
