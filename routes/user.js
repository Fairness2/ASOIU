'use strict';

const express = require('express');
const user = require(__rootdir + '/controllers/user.js');
const auth = require(__rootdir + '/lib/auth.js');

module.exports = function (root) {
	const router = express.Router();

	// todo: Экспресс ведь не против, если я обработчики позже указываю?
	root.use('/user', router);

	router.use('/logout', auth.authenticate)
		.use('/info', auth.authenticate)
		.use('/roles', auth.authenticate);

	router.post('/register', user.register)
		  .post('/login', user.login)
		  .post('/logout', user.logout)
		.get('/info', user.info);

	router.route('/roles')
		.get(user.roles)
		.put(user.setRoles);
};
