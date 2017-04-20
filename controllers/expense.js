'use strict';

const _ = require('lodash');
const moment = require('moment');
const error = require(__libdir + '/error.js');
const page = require(__libdir + '/page.js');
const models = require(__rootdir + '/models');
const Expense = models.Expense;

exports.create = function (req, res) {
	if (!error.require(res, req.body, {
		costItemId: 'Необходима статья',
		periodId: 'Необходим период',
		date: 'Необходима дата',
		value: 'Необходимо значение'
	})) return;

	models.Sequelize.transaction({},
		transact => {
			return models.Limit
				.findOne({
					where: {
						costItemId: req.body.costItemId,
						periodId: req.body.periodId,
						year: moment(req.body.date).year
					}
				}, {
					transaction: transact
				})
				.then(lim => {
					if (!lim) {
						res.status(200).json({
							errors: ['Нет лимита с такими параметрами']
						});
						return;
					}

					lim.remain -= req.body.value;

					return lim.save({
						transaction: transact
					});
				})
				.then(lim => {
					if (!lim) return;

					return Expense
						.create({
							costItemId: req.body.costItemId,
							periodId: req.body.periodId,
							date: req.body.date,
							value: req.body.value
						}, {
							transaction: transact
						});
				});
		})
		.then(exp => {
			res.status(200).json({
				data: exp.id
			});
		})
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.list = function (req, res) {
	let opts = page.get('id', req.query);

	opts.id = req.query.id;

	models.Expense.findAll(
		opts.options
	).then(deps => {
		let arr = deps.map(x => x.toJSON());
		if (opts.invert) arr.reverse();

		res.status(200).json({
			data: arr
		});
	});
};