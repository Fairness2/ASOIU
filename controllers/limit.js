'use strict';

const _ = require('lodash');
const error = require(__libdir + '/error.js');
const page = require(__libdir + '/page.js');
const assoc = require(__libdir + '/assoc.js');
const models = require(__rootdir + '/models');

exports.create = function (req, res) {
	if (!error.require(res, req.body, {
		costItemId: 'Необходима статья',
		periodId: 'Необходим период',
		year: 'Необходим год',
	})) return;

	models.EstimateItemValue
		.findOne({
			where: {
				periodId: req.body.periodId
			},
			include: [{
				model: models.EstimateItem,
				as: 'estimateItem',
				where: { costItemId: req.body.costitemId },
				include: [{
					model: models.Estimate,
					as: 'estimate',
					where: { approvalDate: { $ne: null } }
				}]
			}]
		})
		.then(eiv => {
			if (!eiv) {
				res.status(200).json({
					errors: ['Нет утверждённой суммы для указанных параметров']
				});
				return;
			}

			return models.Limit
				.create({
					costItemId: req.body.costItemId,
					periodId: req.body.periodId,
					year: req.body.year,
					value: eiv.value
				})
				.then(lim => {
					res.status(200).json({
						data: lim
					});
				});
		})
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.list = function (req, res) {
	//let {options, invert} = page.get('id', req.query);

	let options = {
		where: {
			costItemId: req.body.costItemId,
			periodId: req.body.periodId,
			year: req.body.year
		},
		order: [['year', 'asc'],['periodId','asc'],['costItemId','asc']]
	};

	let invert = false;

	models.Limit
		.findAll(options)
		.then(emps => {
			let arr = emps.map(x => x.toJSON());
			if (invert) arr.reverse();

			res.status(200).json({
				data: arr
			});
		})
		.catch(error.handleInternal(req, res));
};