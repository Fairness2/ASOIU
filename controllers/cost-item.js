'use strict';

const _ = require('lodash');
const error = require(__libdir + '/error.js');
const page = require(__libdir + '/page.js');
const assoc = require(__libdir + '/assoc.js');
const models = require(__rootdir + '/models');
const CostItem = models.CostItem;

exports.create = function (req, res) {
	CostItem
		.create({
			name: req.body.name || '',
			parentId: req.body.parentId,
			frcId: req.body.frcId
		}, { context: req.session })
		.then(costItem => {
			res.status(200).json({
				data: costItem.id
			});
		})
		.catch(models.Sequelize.ForeignKeyConstraintError, error.handleForeign(req, res, {
			parentId: 'Такой статьи не существует',
			frcId: 'Такой ЦФО не существует'
		}))
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.update = function (req, res) {
	CostItem
		.update({
			name: req.body.name,
			parentId: req.body.parentId,
			frcId: req.body.frcId
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
					errors: ['Статья не найдена']
				});
			}
		})
		.catch(models.Sequelize.ForeignKeyConstraintError, error.handleForeign(req, res, {
			parentId: 'Такой статьи не существует',
			frcId: 'Такой ЦФО не существует'
		}))
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.list = function (req, res) {
	let opts = page.get('id', req.query);

	// добавляем свои фильтры
	if (req.query.parentId)
		opts.options.where.parentId = req.query.parentId;

	if (req.query.id)
		opts.options.where.id = req.query.id;

	if (req.query.frcId)
		opts.options.where.frcId = req.query.frcId;

	opts.options.include = assoc.deduceInclude(CostItem, {
		frc: true,
		products: req.query.with && (req.query.with==='products' || req.query.with.products || null)
	});

	CostItem
		.findAll(opts.options)
		.then(insts => {
			let arr = _.map(insts, x => x.toJSON());
			if (opts.invert) arr.reverse();

			res.status(200).json({
				data: arr
			});
		})
		.catch(error.handleInternal(req, res));
};