'use strict';

const express = require('express');
const product = require(__rootdir + '/controllers/product.js');
const auth = require(__libdir + '/auth.js');

module.exports = function (root) {
	const router = express.Router();

	root.use('/product', router);

	//router.use(auth.authenticate);

	router.route('/')
		.post(product.create)
		.put(product.update)
		.get(product.list);
};