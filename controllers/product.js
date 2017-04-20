'use strict';

const _ = require('lodash');
const error = require(__libdir + '/error.js');
const page = require(__libdir + '/page.js');
const models = require(__rootdir + '/models');
const Product = models.Product;

exports.create = function (req, res) {
	Product
		.create({
			name: req.body.name,
			costItemId: req.body.costItemId,
			price: req.body.price
		})
		.then(prod => {
			res.status(200).json({
				data: prod.id
			});
		})
		.catch(models.Sequelize.ForeignKeyConstraintError, error.handleForeign(req, res, {
			costItemId: 'Такой статьи не существует'
		}))
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.update = function (req, res) {
	if (!error.require(res, req.body, {
		id: 'Необходимо указать обновляемый товар'
	})) return;

	Product
		.update({
			name: req.body.name,
			costItemId: req.body.costItemId,
			price: req.body.price
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
					errors: ['Товар не найден']
				});
			}
		})
		.catch(models.Sequelize.ForeignKeyConstraintError, error.handleForeign(req, res, {
			typeId: 'Такой статьи не существует'
		}))
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.list = function (req, res) {
	let {options, invert} = page.get('id', req.query);

	if (req.query.id)
		options.where.id = req.query.id;

	if (req.query.costItemId)
		options.where.costItemId = req.query.costItemId;

	Product
		.findAll(options)
		.then(ps => {
			let arr = ps.map(x => x.toJSON());
			if (invert) arr.reverse();

			res.status(200).json({
				data: arr
			});
		});
};