'use strict';

const _ = require('lodash');
const error = require(__libdir + '/error.js');
const page = require(__libdir + '/page.js');
const models = require(__rootdir + '/models');
const CostItem = models.CostItem;

exports.create = function (req, res) {
	CostItem.create({
		name: req.body.name || '',
		parentId: req.body.parentId,
		frcId: req.body.frcId
	}).then(ci => {
		res.status(200).json({
			data: ci.id
		});
	}).catch(models.Sequelize.ForeignKeyError, error.handleForeign(req, res, {
		parentId: 'Такой статьи не существует',
		frcId: 'Такой ЦФО не существует'
	})).catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.update = function (req, res) {
	CostItem.update({
		name: req.body.name,
		parentId: req.body.parentId,
		frcId: req.body.frcId
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
				errors: ['Статья не найдена']
			});
		}
	})
	.catch(models.Sequelize.ForeignKeyError, error.handleForeign(req, res, {
		parentId: 'Такой статьи не существует',
		frcId: 'Такой ЦФО не существует'
	}))
	.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
	.catch(error.handleInternal(req, res));
};

exports.list = function (req, res) {
	let opts = page.get('id', req.query);

	// добавляем свои фильтры
	_.assign(opts.options, {
		parentId: req.query.parentId,
		id: req.query.id
	});

	CostItem.findAll(
		opts.options
	).then(insts => {
		let arr = insts.map(x => x.toJSON());
		if (opts.invert) arr.reverse();

		res.status(200).json({
			data: arr
		});
	});
};