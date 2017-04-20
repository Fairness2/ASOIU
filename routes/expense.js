'use strict';

const express = require('express');
const ctl = require(__rootdir + '/controllers/expense.js');
const auth = require(__libdir + '/auth.js');

module.exports = function (root) {
	const router = express.Router();

	root.use('/expense', router);

	//router.use(auth.authenticate);

	router.route('/')
		.post(ctl.create)
		.get(ctl.list);
};