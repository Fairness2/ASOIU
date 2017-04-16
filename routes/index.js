'use strict';

const express = require('express'),
	user = require('./user.js'),
	employee = require('./employee.js');

module.exports = function (app) {
	let apiRouter = express.Router();
	app.use('/api', apiRouter);

	/*app.use('/login', function (req, res) {
		res.render(require(__rootdir + '/public/login.html'));
	})*/
	user(apiRouter);
	employee(apiRouter);
};
