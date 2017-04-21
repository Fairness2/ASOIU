'use strict';

const config = require('../config.json').db;
const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');

const audit = require(__libdir + '/audit.js')({
	ignore: [
		'password',
		'createdAt',
		'updatedAt'
	]
});

let sequelize = new Sequelize(config.name, config.user, config.password, {
	host: config.host,
	dialect: config.dialect,
	pool: {
		idle: config.timeout
	}
});

const Revisions = require('sequelize-revisions')(sequelize, {
	exclude: [
		'id',
		'createdAt',
		'updatedAt',
		'password'
	]
});

const ModelProxy = function (model) {
	this.__proto__ = model;

	this.bind = function (ctx) {
		return {
			__proto__: this.__proto__,
			context: ctx
		};
	};
};

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
				models[model.name] = new ModelProxy(model);
			}
		});

	return models;
}

function init() {
	let db = {};
		
	// Импортируем рекурсивно модели из этой папки и подпапок
	importDir(__dirname, sequelize, db);

	//Revisions.defineModels(db);

	Object.keys(sequelize.models).forEach(function (modelName) {
		if (db[modelName]) {
			// Связываем модели друг с другом
			if ('associate' in db[modelName]) {
				db[modelName].associate(sequelize.models);
			}

			if (db[modelName].options.enableLog) {
				//db[modelName].enableRevisions();
				audit.enable(db[modelName]);
			}
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
