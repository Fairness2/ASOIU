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
				}, { context: req.session })
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
		where: {},
		order: [['year', 'asc'],['periodId','asc'],['costItemId','asc']]
	};

	if (req.query.costItemId)
		options.where.costItemId = req.query.costItemId;

	if (req.query.periodId)
		options.where.periodId = req.query.periodId;

	if (req.query.year)
		options.where.year = req.query.year;

	let invert = false;

	models.Limit
		.findAll(options)
		.then(emps => {
			let arr = _.map(emps, x => x.toJSON());
			if (invert) arr.reverse();

			res.status(200).json({
				data: arr
			});
		})
		.catch(error.handleInternal(req, res));
};