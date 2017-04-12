'use strict';

const models = require(__rootdir + '/models');
const error = require(__libdir + '/error.js');
const _ = require('lodash');

exports.create = function (req, res) {
	models.Permission.create({
		name: req.body.name
	})
		.then(perm => {
			res.status(200).json({
				data: perm.id
			});
		})
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(models.Sequelize.UniqueConstraintError, error.handleUnique(req, res, {
			name: 'Разрешение уже существует'
		})
		.catch(error.handleInternal(req, res));
};

exports.update = function (req, res) {
	if (!req.body.id) {
		res.status(400).json({
			errors: [{
				path: 'id',
				message: 'Тебуется указать разрешение'
			}]
		});

		return;
	}

	models.Permission.update({
		name: req.body.name
	}, { where: { id: req.body.id } })
		.then((count, rows) => {
			if (count) {
				res.status(200).json({
					data: 'ok'
				});
			} else {
				res.status(200).json({
					errors: ['Указанное разрешение не было найдено']
				});
			}
		})
		.catch(models.Sequelize.UniqueConstraintError, error.handleUnique(req, res, {
			name: 'Разрешение уже существует'
		})
		.catch(error.handleInternal(req, res));

	// обновить подразделения?
};

exports.list = function (req, res) {
	let filter = {};
	let order = [];
	let invertResult = false;
	let field = 'name';

	if (req.query.after) {
		filter[field] = { $gt: req.query.after };
		order.push((field, 'asc'));
	} else if (req.query.before) {
		// В запросе в базу делаем обратную сортировку,
		// клиенту отдаём в возрастающем порядке
		filter[field] = { $lt: req.query.before };
		order.push((field, 'desc'));
		invertResult = true;
	}

	models.Permission.findAll({
		where: filter,
		order: order,
		limit: req.query.limit || 10
	}).then(perms => {
		let arr = perms.map(x => x.toJSON());
		if (invertResult) arr.reverse();

		res.status(200).json({
			data: arr
		});
	});
};