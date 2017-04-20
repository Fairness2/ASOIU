'use strict';

const express = require('express');
const ctl = require(__rootdir + '/controllers/limit.js');
const auth = require(__libdir + '/auth.js');

module.exports = function (root) {
	const router = express.Router();

	root.use('/limit', router);

	//router.use(auth.authenticate);

	router.route('/')
		.post(ctl.create)
		.get(ctl.list);
};