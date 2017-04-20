'use strict';

const express = require('express');
const ctl = require(__rootdir + '/controllers/current-request.js');
const auth = require(__libdir + '/auth.js');

module.exports = function (root) {
	const router = express.Router();

	root.use('/current-request', router);

	//router.use(auth.authenticate);

	router.route('/')
		.post(ctl.create)
		.put(ctl.update)
		.get(ctl.list);

	router.get('/:id', ctl.single);
};