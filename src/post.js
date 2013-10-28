var moment = require('moment');
var db = require('./database');

module.exports = function (title, body, tags, author, cb) {
	var posts = db.handle.collection('posts');

	posts.insert({ title: title, body: body, tags: tags, author: author, on: moment().unix() }, { safe: true }, function (err) {
		if (err) {
			cb(err);
			return;
		}

		cb(null);
	});
};

module.exports.get = function (cb) {
	var posts = db.handle.collection('posts');

	posts.find({ $query: {}, $orderby: { on: -1 } }, function (err, posts) {
		if (err) {
			cb(err);
			return;
		}

		posts.toArray(cb);
	});
};
