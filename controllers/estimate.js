'use strict';

const _ = require('lodash');
const moment = require('moment');
const error = require(__libdir + '/error.js');
const page = require(__libdir + '/page.js');
const assoc = require(__libdir + '/assoc.js');
const models = require(__rootdir + '/models');
const Estimate = models.Estimate;

exports.approve = function (req, res) {
	if (!error.require(res, req.body, {
		id: 'Нужно указать смету'
	})) return;

	Estimate
		.update({
			approvalDate: moment()
		}, {
			where: {
				id: req.body.id,
				approvalDate: { $eq: null }
			},
			context: req.session,
			individualHooks: true
		}).then((count, rows) => {
			if (count) {
				req.status(200).json({
					data: 'ok'
				});
			} else {
				req.status(200).json({
					errors: ['Не найдено']
				});
			}
		})
		.catch(models.Sequelize.UniqueConstraintError, error.handleUnique(req, res, {
			frcId_year: 'Нельзя утвердить более одной сметы на один год',
			year: 'Нельзя утвердить более одной сметы на один год'
		}))
		.catch(error.handleInternal(req, res));
};

exports.list = function (req, res) {
	let {options: opts, invert} = page.get('number', req.query);

	if (req.query.company)
		opts.where.frcId = null;
	else if (req.query.frcId)
		opts.where.frcId = req.query.frcId;
	else
		opts.where.frcId = { $ne: null };


	Estimate.findAll(
		opts
	).then(insts => {
		let arr = _.map(insts, x => x.toJSON());
		if (invert) arr.reverse();

		res.status(200).json({
			data: arr
		});
	})
		.catch(error.handleInternal(req, res));
};

exports.single = function (req, res) {
	Estimate
		.findOne({
			where: { id: req.params.id || '' },
			include: assoc.deduceInclude(Estimate, {
				items: {
					costItem: true,
					values: {
						period: true
					}
				},
				companyEstimates: req.query.with.companyEstimates,
				frcEstimates: req.query.with.frcEstimates
			})
		})
		.then(estimate => {
			if (!estimate) {
				res.status(200).json({
					errors: ['Не найдено']
				});
				return;
			}

			res.status(200).json({
				data: estimate.toJSON()
			});
		})
		.catch(error.handleInternal(req, res));
}