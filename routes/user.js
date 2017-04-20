'use strict';

const express = require('express');
const user = require(__rootdir + '/controllers/user.js');
const auth = require(__libdir + '/auth.js');

module.exports = function (root) {
	const router = express.Router();

	// todo: Экспресс ведь не против, если я обработчики позже указываю?
	root.use('/user', router);
	
	router.post('/register', user.register)
		  .post('/login', user.login)
		  .post('/logout', auth.check(), user.logout)
		.get('/info/:id', auth.check('user.info'), user.info)
		.get('/info', auth.check(), user.info)
		.get('/', auth.check('user.list'), user.list);

	router.route('/roles')
		.get(auth.check(), user.roles)
		.put(auth.check('user.set-roles'), user.setRoles);
};
