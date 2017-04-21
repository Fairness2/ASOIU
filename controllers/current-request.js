'use strict';

const _ = require('lodash');
const error = require(__libdir + '/error.js');
const page = require(__libdir + '/page.js');
const models = require(__rootdir + '/models');
const CurrentRequest = models.CurrentRequest;

exports.create = function (req, res) {
	if (!error.require(res, req.body, {
		requestId: 'Необходимо указать исходную заявку',
		year: 'Необходим год',
		periodId: 'Необходим период',
		items: [x => _.isArray(x) && x.length, 'Необходима хотя бы 1 позиция']
	})) return;

	Promise.all([
		models.Request.findOne({
			where: {
				id: req.body.requestId,
				year: req.body.year
			}
		}, {
				include: [{
					model: models.RequestItem,
					as: 'items',
					where: { periodId: req.body.periodId }
				}]
			}),
		models.CurrentRequest.findAll({
			where: {
				requestId: req.body.requestId
			},
			include: [{
				model: models.CurrentRequestItem,
				as: 'items',
				attributes: {
					include: [[models.Sequelize.fn('sum', models.Sequelize.col('quantity')), 'total']]
				}
			}],
			group: ['productId']
		})
	])
		.then(([rq, crs]) => {
			// надо чтобы сумма товаров в текущих заявках не превышал заявленного изначально
			if (_.every(req.body.items, item =>
				_.some(rq.items, j =>
					j.productId === item.productId
					&& j.quantity >= item.quantity + (_.find(crs.items, x => x.productId === item.productId) || { total: 0 }).total
				)
			)) {
				return CurrentRequest
					.create({
						year: req.body.year,
						requestId: req.body.requestId,
						periodId: req.body.periodId
					}, { context: req.session })
					.then(inst => {
						res.status(200).json({
							data: inst.id
						});
					});
			} else {
				res.status(200).json({
					errors: ['Некоторые товары израсходованы либо не были заявлены']
				});
			}
		})
		.catch(models.Sequelize.ForeignKeyError, error.handleForeign(req, res, {
			productId: 'Такого товара/услуги не существует',
			requestId: 'Такой заявки не существует',
			periodId: 'Такого периода не существует'
		}))
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.update = function (req, res) {
	if (!error.require(res, req.body, {
		id: 'Необходимо указать изменяемую текущую заявку',
		requestId: 'Необходимо указать исходную заявку',
		year: 'Необходим год',
		periodId: 'Необходим период',
		items: [x => _.isArray(x) && x.length, 'Необходима хотя бы 1 позиция']
	})) return;

	Promise.all([
		CurrentRequest.findOne({
			where: {
				id: req.body.id
			},
			include: [{
				model: models.CurrentRequestItem,
				as: 'items'
			}]
		}),
		CurrentRequest.findAll({
			where: {
				requestId: req.body.requestId,
				id: { $ne: req.body.id }
			},
			include: [{
				model: models.CurrentRequestItem,
				as: 'items',
				attributes: {
					include: [[models.Sequelize.fn('sum', models.Sequelize.col('quantity')), 'total']]
				}
			}],
			group: ['productId']
		})
	])
		.then(([inst, existing]) => {
			if (!inst) {
				req.status(400).json({
					errors: ['Заявка не найдена']
				});

				return;
			}

			// проверяем, чтобы вместе с остальными было меньше
			// может сломаться без транзакции
			if (!_.every(req.body.items, item =>
				_.some(inst.items, j =>
					j.productId === item.productId
					&& j.quantity >= item.quantity + (_.find(existing.items, x => x.productId === item.productId) || { total: 0 }).total
				)
			)) {
				req.status(200).json({
					errors: ['Некоторые товары исчерпаны']
				});

				return;
			}

			inst.update({
				year: req.body.year,
				requestId: req.body.requestId,
				periodId: req.body.periodId
			}, {
				context: req.session,
				individualHooks: true
				});

			inst.setItems(
				_.map(
					req.body.items,
					item => models.CurrentRequestItem.build({
						productId: item.productId,
						quantity: item.quantity
					})
				),
				{ context: req.session }
			);

			return inst.save({ context: req.session })
				.then(() => {
					res.status(200).json({
						data: 'ok'
					});
				});
		})
		.catch(models.Sequelize.ForeignKeyError, error.handleForeign(req, res, {
			productId: 'Такого товара/услуги не существует',
			requestId: 'Такой заявки не существует',
			periodId: 'Такого периода не существует'
		}))
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.list = function (req, res) {
	let opts = page.get('number', req.query);

	CurrentRequest.findAll(
		opts.options
	).then(insts => {
		let arr = insts.map(x => x.toJSON());
		if (opts.invert) arr.reverse();

		res.status(200).json({
			data: arr
		});
	});
};

exports.single = function (req, res) {
	CurrentRequest.findOne({
		where: { id: req.params.id || '' },
		include: [{
			model: models.CurrentRequestItem,
			as: 'items',
			include: [{
				model: models.Product,
				as: 'product'
			}]
		}]
	})
		.then(cr => {
			if (!cr) {
				res.status(200).json({
					errors: ['Не найдено']
				});
				return;
			}

			res.status(200).json({
				data: cr.toJSON()
			});
		})
		.catch(error.handleInternal(req, res));
}