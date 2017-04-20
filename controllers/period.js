'use strict';

const _ = require('lodash');
const error = require(__libdir + '/error.js');
const page = require(__libdir + '/page.js');
const models = require(__rootdir + '/models');
const Period = models.Period;

exports.create = function (req, res) {
	Period
		.create({
			name: req.body.name,
			typeId: req.body.typeId,
			number: req.body.number
		})
		.then(per => {
			res.status(200).json({
				data: per.id
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

	Period
		.update({
			name: req.body.name,
			typeId: req.body.typeId,
			number: req.body.number
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
					errors: ['Период не найден']
				});
			}
		})
		.catch(models.Sequelize.ForeignKeyConstraintError, error.handleForeign(req, res, {
			typeId: 'Такого типа динамики не существует'
		}))
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.list = function (req, res) {
	let {options, invert} = page.get('id', req.query);

	options.where.id = req.query.id;

	models.Period
		.findAll(options)
		.then(ps => {
			let arr = ps.map(x => x.toJSON());
			if (invert) arr.reverse();

			res.status(200).json({
				data: arr
			});
		});
};