'use strict';

const _ = require('lodash');
const error = require(__libdir + '/error.js');
const page = require(__libdir + '/page.js');
const assoc = require(__libdir + '/assoc.js');
const models = require(__rootdir + '/models');
const Department = models.Department;

exports.create = function (req, res) {
	Department
		.create({
			fullName: req.body.fullName || '',
			shortName: req.body.shortName || ''
		}, { context: req.session })
		.then(dep => {
			res.status(200).json({
				data: dep.id
			});
		})
		.catch(models.Sequelize.UniqueConstraintError, error.handleUnique(req, res, {
			fullName: 'Подразделение с таким названием уже существует',
			shortName: 'Подразделение с таким названием уже существует'
		}))
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.update = function (req, res) {
	Department
		.update({
			fullName: req.body.fullName,
			shortName: req.body.shortName
		}, {
			where: { id: req.body.id },
			context: req.session,
			individualHooks: true
		})
		.then((count, list) => {
			if (count) {
				res.status(200).json({
					data: 'ok'
				});
			} else {
				res.status(200).json({
					errors: ['Подразделение не найдено']
				});
			}
		})
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.list = function (req, res) {
	let opts = page.get('fullName', req.query);

	if (req.query.id)
		opts.options.where.id = req.query.id;

	if (req.query.with === 'employee')
		opts.options.include = assoc.deduceInclude(models.Department, 'employee');

	models.Department.findAll(
		opts.options
	).then(deps => {
		let arr = _.map(deps, x => x.toJSON());
		if (opts.invert) arr.reverse();

		res.status(200).json({
			data: arr
		});
		})
		.catch(error.handleInternal(req, res));
};
