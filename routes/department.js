'use strict';

const express = require('express');
const department = require(__rootdir + '/controllers/department.js');
const auth = require(__libdir + '/auth.js');

module.exports = function (root) {
	const router = express.Router();

	root.use('/department', router);

	router.route('/')
		.post(auth.check('dep.create'), department.create)
		.put(auth.check('dep.update'), department.update)
		.get(auth.check('dep.list'), department.list);
};