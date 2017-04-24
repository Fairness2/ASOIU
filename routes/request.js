'use strict';

const express = require('express');
const ctl = require(__rootdir + '/controllers/request.js');
const ctl2 = require(__rootdir + '/controllers/request2.js');
const auth = require(__libdir + '/auth.js');

module.exports = function (root) {
	const router = express.Router();

	root.use('/request', router);

	//router.use(auth.authenticate);

	router.route('/')
		.post(ctl2.create)
		.put(ctl2.update)
		.get(ctl.list);

	router.get('/:id', ctl.single);
};