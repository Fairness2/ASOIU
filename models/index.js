'use strict';

const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');
const config = require('../config.json').db;

function importDir(dirname, sequelize, models) {
	models = models || {};

	fs.readdirSync(dirname)
		.filter(function (file) {
			return (file.indexOf('.') !== 0) && (file !== 'index.js');
		})
		.forEach(function (file) {
			if (fs.statSync(path.join(dirname, file)).isDirectory()) {
				// Имортируем папку рекурсивно
				importDir(path.join(dirname, file), sequelize, models);
			} else {
				// Импортируем отдельную модель
				let model = sequelize.import(path.join(dirname, file));
				models[model.name] = model;
			}
		});

	return models;
}

function init() {
	let sequelize = new Sequelize(config.name, config.user, config.password, {
		host: config.host,
		dialect: config.dialect,
		pool: {
			idle: config.timeout
		}
	});

	let db = {};

	// Импортируем рекурсивно модели из этой папки и подпапок
	importDir(__dirname, sequelize, db);

	// Связываем модели друг с другом
	Object.keys(sequelize.models).forEach(function (modelName) {
		if ('associate' in db[modelName]) {
			db[modelName].associate(sequelize.models);
		}
	});

	db.sequelize = sequelize;
	db.Sequelize = Sequelize;

	db.sync = function () {
		return sequelize.sync({ force: false });
	};

	return db;
};

module.exports = init();