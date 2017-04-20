'use strict';

const _ = require('lodash');
const error = require(__libdir + '/error.js');
const page = require(__libdir + '/page.js');
const models = require(__rootdir + '/models');
const PeriodType = models.PeriodType;

exports.create = function (req, res) {
	PeriodType
		.create({
			name: req.body.name,
			length: req.body.length
		})
		.then(pt => {
			res.status(200).json({
				data: pt.id
			});
		})
		.catch(models.Sequelize.ForeignKeyConstraintError, error.handleForeign(req, res, {
			typeId: 'Такого типа динамики не существует'
		}))
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.update = function (req, res) {
	if (!error.require(res, req.body, {
		id: 'Необходимо указать обновляемый период'
	})) return;

	PeriodType
		.update({
			name: req.body.name,
			length: req.body.length
		}, {
			where: { id: req.body.id }
		})
		.then((count, list) => {
			if (count) {
				res.status(200).json({
					data: 'ok'
				});
			} else {
				res.status(200).json({
					errors: ['Тип динамики не найден']
				});
			}
		})
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.list = function (req, res) {
	let {options, invert} = page.get('id', req.query);

	if (req.query.id)
		options.where.id = req.query.id;

	models.PeriodType
		.findAll(options)
		.then(pts => {
			let arr = pts.map(x => x.toJSON());
			if (invert) arr.reverse();

			res.status(200).json({
				data: arr
			});
		});
};