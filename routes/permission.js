'use strict';

const express = require('express');
const permission = require(__rootdir + '/controllers/permission.js');
const auth = require(__libdir + '/auth.js');

module.exports = function (root) {
	const router = express.Router();

	root.use('/permission', router);

	//router.use(auth.authenticate);

	router.route('/')
		.post(permission.create)
		.put(permission.update)
		.get(permission.list);
};
