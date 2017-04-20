'use strict';

const express = require('express');
const auth = require(__libdir + '/auth.js');
const estimate = require(__rootdir + '/controllers/estimate.js');
const estimateFRC = require(__rootdir + '/controllers/estimate-frc.js');
const estimateCompany = require(__rootdir + '/controllers/estimate-company.js');

module.exports = function (root) {
	const router = express.Router();

	root.use('/estimate', router);

	//router.use(auth.authenticate);

	router.route('/company')
		.post(estimateCompany.create)
		.put(estimateCompany.update);

	router.route('/frc')
		.post(estimateFRC.create)
		.put(estimateFRC.update);

	router.post('/approve', estimate.approve);

	router.get('/:id', estimate.single);
	router.get('/', estimate.list);
};