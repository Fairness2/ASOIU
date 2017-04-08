'use strict';

const express = require('express'),
	user = require('./user.js'),
	employee = require('./employee.js');

module.exports = function (app) {
	let apiRouter = express.Router();
	app.use('/api', apiRouter);

	user(apiRouter);
	employee(apiRouter);
};