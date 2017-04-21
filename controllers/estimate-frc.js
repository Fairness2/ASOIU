'use strict';

const _ = require('lodash');
const moment = require('moment');
const error = require(__libdir + '/error.js');
const page = require(__libdir + '/page.js');
const assoc = require(__libdir + '/assoc.js');
const models = require(__rootdir + '/models');
const Estimate = models.Estimate;

exports.create = function (req, res) {
	if (!error.require(res, req.body, {
		year: 'Необходим год',
		frcId: 'Необходим ЦФО',
		requests: [x => _.isArray(x) && x.length, 'Необходимо включить хотя бы 1 заявку']
	}) ||
		!_.every(req.body.requests, x => {
			if (_.isString(x)) return true;
			res.status(400).json({
				errors: [{
					value: x,
					message: 'Неверный формат идентификатора'
				}]
			});
		})) return;

	Promise.all([
		models.Request.findAll({
			where: {
				id: { $in: req.body.requests },
				year: req.body.year
			},
			include: assoc.deduceInclude(models.Request, {
				items: {
					product: {
						costItem: true
					}
				}
			})
		}),
		models.CostItem.findAll({
			where: {
				id: { $in: _.keys(req.body.items) },
				frcId: req.body.frcId
			}
		})])
		.then(([requests, costItems]) => {
			if (!_.all(req.body.requests, i => {
				if (_.some(requests, j => j.id === i))
					return true;
				else
					res.status(200).json({
						errors: [{
							value: i,
							message: 'Такой заявки на укзаанный год не существует'
						}]
					});
			})) return;

			if (_.isObject(req.body.items) &&
				!_.all(_.keys(req.body.items), id => {
					if (_.some(costItems, j => j.id === id))
						return true;
					else
						res.status(200).json({
							errors: [{
								value: id,
								message: 'Для данного ЦФО нет такой статьи'
							}]
						});
				})) return;

			let est = Estimate.build({
				name: req.body.name,
				year: req.body.year,
				frcId: req.body.frcId,
				requests: requests
			});

			let estimateItems = {};

			// Распихиваем заявки по статьям
			_.forEach(requests, request => {
				_.forEach(request.items, item => {
					if (item.product.costItem.frcId === est.frcId) {
						// Создаём позицию сметы
						if (!estimateItems[item.product.costItemId])
							estimateItems[item.product.costItemId] = {};

						let estItemValues = estimateItems[item.costItemId];

						// Создаём значение позиции сметы
						if (!estItemValues[item.periodId])
							estItemValues[item.periodId] = 0;

						estItemValues[item.periodId] += item.quantity * item.product.price;
					}
				})
			});

			// Добавляем суммы не из заявок
			if (_.isObject(req.body.items))
				_.forEach(req.body.items, (item, costItemId) =>
					_.forEach(item, (value, periodId) => {
						// Создаём позицию сметы
						if (!estimateItems[costItemId])
							estimateItems[costItemId] = {};

						estItemValues = estimateItems[item.costItemId];

						// Создаём значение позиции сметы
						if (!estItemValues[periodId])
							estItemValues[periodId] = 0;

						estItemValues[periodId] += value;
					}));

			// Преобразовываем нашу структуру в экземпляры моделей
			return est
				.setItems(_.map(estimateItems, (values, costItemId) =>
					models.EstimateItem.build({
						costItemId: costItemId,
						values: _.map(values, (value, periodId) => ({
							value: value,
							periodId: periodId
						}))
					})),
				{ context: req.session })
				.then(() => est.save({ context: req.session }));
		})
		.then(() => {
			res.status(200).json({
				data: est.id
			});
		})
		.catch(models.Sequelize.ForeignKeyError, error.handleForeign(req, res, {
			costItemId: 'Такой статьи не существует',
			frcId: 'Такого ЦФО не существует',
			periodId: 'Такого периода не существует'
		}))
		.catch(models.Sequelize.UniqueConstraintError, error.handleUnique(req, res, {
			estimateId_costItemId: 'В смете уже есть такая статья'
			// todo: первичный ключ?
		}))
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.update = function (req, res) {
	if (!error.require(res, req.body, {
		id: 'Необходимо указать обновляемую смету',
		year: 'Необходим год',
		frcId: 'Необходим ЦФО',
		requests: [x => _.isArray(x) && x.length, 'Необходимо включить хотя бы 1 заявку']
	}) ||
		!_.every(req.body.requests, x => {
			if (_.isString(x)) return true;
			res.status(400).json({
				errors: [{
					value: x,
					message: 'Неверный формат идентификатора'
				}]
			});
		})) return;

	Promise.all([
		models.Request.findAll({
			where: {
				id: { $in: req.body.requests },
				year: req.body.year
			},
			include: assoc.deduceInclude(models.Request, {
				items: {
					product: {
						costItem: true
					}
				}
			})
		}),
		models.CostItem.findAll({
			where: {
				id: { $in: _.keys(req.body.items) },
				frcId: req.body.frcId
			}
		}),
		models.Estimate.findById(req.body.id)
	])
		.then(([requests, costItems, est]) => {
			if (!est) {
				res.status(200).json({
					errors: 'Указанной сметы не найдено'
				});
				return;
			}

			if (!_.all(req.body.requests, i => {
				if (_.some(requests, j => j.id === i))
					return true;
				else
					res.status(200).json({
						errors: [{
							value: i,
							message: 'Такой заявки на укзаанный год не существует'
						}]
					});
			})) return;

			if (_.isObject(req.body.items) &&
				!_.all(_.keys(req.body.items), id => {
					if (_.some(costItems, j => j.id === id))
						return true;
					else
						res.status(200).json({
							errors: [{
								value: id,
								message: 'Для данного ЦФО нет такой статьи'
							}]
						});
				})) return;

			est.name = req.body.name;
			est.year = req.body.year;
			est.frcId = req.body.frcId;
			est.requests = requests;

			let estimateItems = {};

			// Распихиваем заявки по статьям
			_.forEach(requests, request => {
				_.forEach(request.items, item => {
					if (item.product.costItem.frcId === est.frcId) {
						// Создаём позицию сметы
						if (!estimateItems[item.product.costItemId])
							estimateItems[item.product.costItemId] = {};

						let estItemValues = estimateItems[item.costItemId];

						// Создаём значение позиции сметы
						if (!estItemValues[item.periodId])
							estItemValues[item.periodId] = 0;

						estItemValues[item.periodId] += item.quantity * item.product.price;
					}
				})
			});

			// Добавляем суммы не из заявок
			if (_.isObject(req.body.items))
				_.forEach(req.body.items, (item, costItemId) =>
					_.forEach(item, (value, periodId) => {
						// Создаём позицию сметы
						if (!estimateItems[costItemId])
							estimateItems[costItemId] = {};

						estItemValues = estimateItems[item.costItemId];

						// Создаём значение позиции сметы
						if (!estItemValues[periodId])
							estItemValues[periodId] = 0;

						estItemValues[periodId] += value;
					}));

			// Преобразовываем нашу структуру в экземпляры моделей
			return est
				.setItems(_.map(estimateItems, (values, costItemId) =>
					models.EstimateItem.build({
						costItemId: costItemId,
						values: _.map(values, (value, periodId) => ({
							value: value,
							periodId: periodId
						}))
					})),
				{ context: req.session })
				.then(() => est.save({ context: req.session }));
		})
		.then(() => {
			res.status(200).json({
				data: est.id
			});
		})
		.catch(models.Sequelize.ForeignKeyError, error.handleForeign(req, res, {
			costItemId: 'Такой статьи не существует',
			frcId: 'Такого ЦФО не существует',
			periodId: 'Такого периода не существует'
		}))
		.catch(models.Sequelize.UniqueConstraintError, error.handleUnique(req, res, {
			estimateId_costItemId: 'В смете уже есть такая статья'
			// todo: первичный ключ?
		}))
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};
