'use strict';

const express = require('express');
const role = require(__rootdir + '/controllers/role.js');
const auth = require(__rootdir + '/lib/auth.js');

module.exports = function (root) {
	const router = express.Router();

	root.use('/role', router);

	//router.use(auth.authenticate);

	router.route('/')
		.post(role.create)
		.put(role.update)
		.get(role.list);

	router.route('/permissions')
		.put(role.setPermissions)
		.get(role.permissions);
};
