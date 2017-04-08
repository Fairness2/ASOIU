﻿'use strict';

const express = require('express');
const employee = require(__rootdir + '/controllers/employee.js');
const auth = require(__rootdir + '/lib/auth.js');

module.exports = function (root) {
	const router = express.Router();

	root.use('/employee', router);

	//router.use(auth.authenticate);

	router.route('/')
		.post(employee.create)
		.put(employee.update)
		.get(employee.list);
};
