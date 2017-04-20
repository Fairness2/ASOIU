'use strict';

const express = require('express'),
	fs = require('fs'),
	path = require('path'),
	user = require('./user.js'),
	employee = require('./employee.js');

function requireDir(dirname, modules) {
	modules = modules || {};

	fs.readdirSync(dirname)
		.filter(function (file) {
			return (file.indexOf('.') !== 0) && (file !== 'index.js');
		})
		.forEach(function (file) {
			if (fs.statSync(path.join(dirname, file)).isDirectory()) {
				// Имортируем папку рекурсивно
				requireDir(path.join(dirname, file), modules);
			} else {
				// Импортируем отдельную модель
				let m = require(path.join(dirname, file));
				modules[file.substr(0, file.indexOf('.'))] = m;
			}
		});

	return modules;
}

module.exports = function (app) {
	let apiRouter = express.Router();
	app.use('/api', apiRouter);

	let modules = requireDir(__dirname);

	for (let key in modules)
		modules[key](apiRouter);
};
