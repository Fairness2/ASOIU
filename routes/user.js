'use strict';

const express = require('express');
const user = require(__rootdir + '/controllers/user.js');

module.exports = function (route) {
	const router = express.Router();

	// todo: Экспресс ведь не против, если я обработчики позже указываю?
	route.use('/user', router);

	// todo: прицепить всякие атуентификации, авторизации и др.
	router.post('/register', user.register)
		.post('/login', user.login)
		.post('/logout', user.logout)
		.get('/info', user.info)
		.post('/register', user.register);
};