const keystone = require('keystone');

function signin (req, res) {
	// username/password are obligatory
	if (!req.body.username || !req.body.password) {
		return res.json({ success: false });
	}

	keystone.list('User').model
		.findOne({ email: req.body.username })
		.exec(function (err, user) {
			if (err || !user) {
				return res.json({
					success: false,
					session: false,
					user: null,
					error: (err && err.message ? err.message : false)
						|| 'Sorry, there was an issue signing you in, please try again.',
				});
			}

			keystone.session.signin({ email: user.email, password: req.body.password }, req, res, function (user) {
				return res.json({
					success: true,
					session: true,
				});
			}, function (err) {
				return res.json({
					success: false,
					session: false,
					message: (err && err.message ? err.message : false)
						|| 'Sorry, there was an issue signing you in, please try again.'
				});
			});
		});
}

// you'll want one for signout too
function signout (req, res) {
	keystone.session.signout(req, res, function () {
		res.json({ success: true });
	});
}

const router = keystone.createRouter();

router.post('/signin', signin);
router.get('/signout', signout);

module.exports = router;
