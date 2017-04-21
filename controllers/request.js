'use strict';

const _ = require('lodash');
const error = require(__libdir + '/error.js');
const page = require(__libdir + '/page.js');
const assoc = require(__libdir + '/assoc.js');
const models = require(__rootdir + '/models');
const Request = models.Request;

exports.create = function (req, res) {
	if (!error.require(res, req.body, {
		year: 'Необходим год',
		items: [x => _.isArray(x) && x.length, 'Необходима хотя бы 1 позиция']
	}) ||
		!_.every(req.body.items, x => error.require(x, {
			periodId: 'Необходим период',
			productId: 'Необходимо указать товар',
			quantity: 'Неоходимо количество'
		}))) return;

	let rq = Request.build({
		year: req.body.year,
		requesterId: req.session.user.employeeId,
		items: req.body.items
	});

	rq.save({ context: req.session })
		.then(() => {
			res.status(200).json({
				data: rq.id
			});
		})
		.catch(models.Sequelize.ForeignKeyError, error.handleForeign(req, res, {
			productId: 'Такого товара/услуги не существует',
			requesterId: 'Такого сотрудника не существует',
			periodId: 'Такого периода не существует'
		}))
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.update = function (req, res) {
	if (!error.require(res, req.body, {
		id: 'Необходимо указать изменяемую заявку',
		year: 'Необходим год',
		items: [x => _.isArray(x) && x.length, 'Необходима хотя бы 1 позиция']
	}) ||
		!_.every(req.body.items, x => error.require(x, {
			periodId: 'Необходим период',
			productId: 'Необходимо указать товар',
			quantity: 'Неоходимо количество'
		}))) return;

	Promise.all([
		Request.findOne({
			where: {
				id: req.body.id
			}
		}),
		models.CurrentRequest.count({
			where: { requestId: req.body.id }
		})])
		.then(([inst, currentCount]) => {
			if (!inst) {
				req.status(400).json({
					errors: ['Заявка не найдена']
				});

				return;
			}

			if (currentCount) {
				res.status(200).json({
					errors: [{
						message: 'Нельзя обновить заявку, на которую ссылаются текущие заявки (' + currentCount + ' шт.)',
						value: currentCount
					}]
				});

				return;
			}

			inst.update({
				year: req.body.year
			}, {
				context: req.session,
				individualHooks: true
				});

			inst.setItems(
				_.map(
					req.body.items,
					item => models.CurrentRequestItem.build({
						productId: item.productId,
						periodId: item.periodId,
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

	Request.findAll(
		opts.options
	).then(insts => {
		let arr = insts.map(x => x.toJSON());
		if (opts.invert) arr.reverse();

		res.status(200).json({
			data: arr
		});
		})
		.catch(error.handleInternal(req, res));
};

exports.single = function (req, res) {
	Request
		.findOne({
			where: { id: req.params.id || '' },
			include: assoc.deduceInclude(Request, {
				items: {
					product: true,
					period: true
				}
			})
		})
		.then(request => {
			if (!request) {
				res.status(200).json({
					errors: ['Не найдено']
				});
				return;
			}

			res.status(200).json({
				data: request.toJSON()
			});
		})
		.catch(error.handleInternal(req, res));
}