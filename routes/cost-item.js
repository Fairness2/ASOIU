'use strict';

const express = require('express');
const ctl = require(__rootdir + '/controllers/cost-item.js');
const auth = require(__libdir + '/auth.js');

module.exports = function (root) {
	const router = express.Router();

	root.use('/cost-item', router);

	//router.use(auth.authenticate);

	router.route('/')
		.post(ctl.create)
		.put(ctl.update)
		.get(ctl.list);
};