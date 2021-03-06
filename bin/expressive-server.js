var http = require('http');
var express = require('express');
var db = require('../src/database');
var auth = require('../src/auth');
var request_handlers = require('../src/request-handlers');

var app = express();

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
if (process.env.NODE_ENV === 'production') {
	app.use(express.cookieSession({ secret: process.env.COOKIE_SECRET }));
}
else {
	app.use(express.cookieSession({ secret: 'not so secret' }));
}
app.use(express['static'](__dirname + '/../public'));

app.use(function (req, res, next) {
	if (!req.session) {
		req.session = {};
	}

	if (!req.session.messages) {
		req.session.messages = [];
	}

	next();
});

request_handlers.register(app);

db.connect(function (err) {
	if (err) {
		throw err;
	}

	var port = process.env.PORT || 3000;
	http.createServer(app).listen(port);
	console.log("Listening on port " + port + ".");
});

