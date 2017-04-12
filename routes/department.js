'use strict';

const express = require('express');
const department = require(__rootdir + '/controllers/department.js');
const auth = require(__libdir + '/auth.js');

module.exports = function (root) {
	const router = express.Router();

	root.use('/department', router);

	//router.use(auth.authenticate);

	router.route('/')
		.post(department.create)
		.put(department.update)
		.get(department.list);
};
