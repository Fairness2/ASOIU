'use strict';

const models = require(__rootdir + '/models');
const Department = models.Department;
const error = require(__libdir + '/error.js');

exports.create = function (req, res) {
	Department.create({
		fullName: req.body.fullName || '',
		shortName: req.body.shortName || ''
	}).then(dep => {
		res.status(200).json({
			data: dep.id
		});
	}).catch(models.Sequelize.UniqueConstraintError, error.handleUnique(req, res, {
		fullName: 'Подразделение с таким названием уже существует',
		shortName: 'Подразделение с таким названием уже существует'
	})).catch(error.handleInternal(req, res));
};

exports.update = function (req, res) {
	Department.update({
		fullName: req.body.fullName,
		shortName: req.body.shortName
	}, {
		where: { id: req.body.id }
	}).then((count, list) => {
		if (count) {
			res.status(200).json({
				data: 'ok'
			});
		} else {
			res.status(200).json({
				errors: ['Подразделение не найдено']
			});
		}
	}).catch(error.handleInternal(req, res));
};

exports.list = function (req, res) {
	let filter = {};
	let order = [];
	let invertResult = false;
	let field = 'fullName';

	//todo: Обобщить это страницевание
	if (req.query.after) {
		filter[field] = { $gt: req.query.after };
		order.push((field, 'asc'));
	} else if (req.query.before) {
		filter[field] = { $lt: req.query.before };
		order.push((field, 'desc'));
		invertResult = true;
	}

	models.Department.findAll({
		where: filter,
		order: order,
		limit: req.query.limit || 10
	}).then(deps => {
		let arr = deps.map(x => x.toJSON());
		if (invertResult) arr.reverse();

		res.status(200).json({
			data: arr
		});
	});
};