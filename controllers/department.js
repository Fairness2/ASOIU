'use strict';

const _ = require('lodash');
const error = require(__libdir + '/error.js');
const page = require(__libdir + '/page.js');
const models = require(__rootdir + '/models');
const Department = models.Department;

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
	let opts = page.get('fullName', req.query);

	

	models.Department.findAll(
		opts.options
	).then(deps => {
		let arr = deps.map(x => x.toJSON());
		if (opts.invert) arr.reverse();

		res.status(200).json({
			data: arr
		});
	});
};