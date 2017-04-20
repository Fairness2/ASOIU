'use strict';

const express = require('express');
const ctl = require(__rootdir + '/controllers/test.js');
const auth = require(__libdir + '/auth.js');

module.exports = function (root) {
	const router = express.Router();

	// todo: Экспресс ведь не против, если я обработчики позже указываю?
	root.use('/test', router);
	
	router.post('/setup', ctl.setup);
};
