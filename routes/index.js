'use strict';

const express = require('express'),
	user = require('./user.js');

module.exports = function (app) {
	let apiRouter = express.Router();
	app.use('/api', apiRouter);

	user(apiRouter);
};