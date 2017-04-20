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
		estimates: [x => _.isArray(x) && x.length, 'Необходимо включить хотя бы 1 смету']
	}) ||
		!_.every(req.body.estimates, x => {
			if (_.isString(x)) return true;
			res.status(400).json({
				errors: [{
					value: x,
					message: 'Неверный формат идентификатора'
				}]
			});
		})) return;

	models.Estimate
		.findAll({
			where: {
				id: { $in: req.body.estimates }
			},
			include: assoc.deduceInclude(Estimate, {
				items: {
					costItem: true,
					values: {
						period: true
					}
				}
			})
		})
		.then(estimates => {
			if (!_.all(req.body.estimates, i => {
				if (_.some(requests, j => j.id === i))
					return true;
				else
					res.status(200).json({
						errors: [{
							value: i,
							message: 'Такой сметы не существует'
						}]
					});
			})) return;

			if (!_.all(estimates, est => est.year === estimates[0].year)) {
				res.status(200).json({
					errors: ['Года указанных смет не совпадают']
				});
				return;
			}

			let counts = _.countBy(estimates, x => x.frcId);

			if (_.some(counts, x => x > 1)) {
				res.status(200).json({
					errors: (() => {
						let err = [];

						_.forEach(counts, (v, k) => {
							if (v > 1) err.push({
								key: k,
								value: v,
								message: 'Смета данного ЦФО включена более одного раза'
							});
						});

						return err;
					})()
				});
				return;
			}

			let est = Estimate.build({
				name: req.body.name,
				year: estimates[0].year,
				frcId: null
				// включать ссылки на заяки?
			});

			let estimateItems = {};

			// Добавляем суммы не из заявок
			_.forEach(estimates, estimate =>
				_.forEach(estimate.items, item =>
					_.forEach(item.values, value => {
						// Создаём позицию сметы
						if (!estimateItems[item.costItemId])
							estimateItems[item.costItemId] = {};

						estItemValues = estimateItems[item.costItemId];

						// Создаём значение позиции сметы
						if (!estItemValues[value.periodId])
							estItemValues[value.periodId] = 0;

						estItemValues[value.periodId] += value.value;
					})));

			// Преобразовываем нашу структуру в экземпляры моделей
			est.setItems(_.map(estimateItems, (values, costItemId) =>
				models.EstimateItem.build({
					costItemId: costItemId,
					values: _.map(values, (value, periodId) => ({
						value: value,
						periodId: periodId
					}))
				})));

			return est.save();
		})
		.then(() => {
			res.status(200).json({
				data: est.id
			});
		})
		.catch(models.Sequelize.ForeignKeyError, error.handleForeign(req, res, {
			costItemId: 'Такой статьи не существует',
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
		id: 'Необходимо укзаать обновляемую смету',
		estimates: [x => _.isArray(x) && x.length, 'Необходимо включить хотя бы 1 смету']
	}) ||
		!_.every(req.body.estimates, x => {
			if (_.isString(x)) return true;
			res.status(400).json({
				errors: [{
					value: x,
					message: 'Неверный формат идентификатора'
				}]
			});
		})) return;

	Promise.all([
		models.Estimate
			.findAll({
				where: {
					id: { $in: req.body.estimates }
				},
				include: assoc.deduceInclude(Estimate, {
					items: {
						costItem: true,
						values: {
							period: true
						}
					}
				})
			}),
		models.Estimate
			.findOne({
				where: {
					id: req.body.id,
					frcId: null
				}
			})
	])
		.then(([estimates, est]) => {
			if (!est) {
				res.status(200).json({
					errors: ['Смета не найдена']
				});
				return;
			}

			if (!_.all(req.body.estimates, i => {
				if (_.some(requests, j => j.id === i))
					return true;
				else
					res.status(200).json({
						errors: [{
							value: i,
							message: 'Такой сметы не существует'
						}]
					});
			})) return;

			if (!_.all(estimates, est => est.year === estimates[0].year)) {
				res.status(200).json({
					errors: ['Года указанных смет не совпадают']
				});
				return;
			}

			let counts = _.countBy(estimates, x => x.frcId);

			if (_.some(counts, x => x > 1)) {
				res.status(200).json({
					errors: (() => {
						let err = [];

						_.forEach(counts, (v, k) => {
							if (v > 1) err.push({
								key: k,
								value: v,
								message: 'Смета данного ЦФО включена более одного раза'
							});
						});

						return err;
					})()
				});
				return;
			}

			est.name = req.body.name;
			est.year = estimates[0].year;
			est.frcId = null;

			let estimateItems = {};

			// Добавляем суммы не из заявок
			_.forEach(estimates, estimate =>
				_.forEach(estimate.items, item =>
					_.forEach(item.values, value => {
						// Создаём позицию сметы
						if (!estimateItems[item.costItemId])
							estimateItems[item.costItemId] = {};

						estItemValues = estimateItems[item.costItemId];

						// Создаём значение позиции сметы
						if (!estItemValues[value.periodId])
							estItemValues[value.periodId] = 0;

						estItemValues[value.periodId] += value.value;
					})));

			// Преобразовываем нашу структуру в экземпляры моделей
			est.setItems(_.map(estimateItems, (values, costItemId) =>
				models.EstimateItem.build({
					costItemId: costItemId,
					values: _.map(values, (value, periodId) => ({
						value: value,
						periodId: periodId
					}))
				})));

			return est.save();
		})
		.then(() => {
			res.status(200).json({
				data: est.id
			});
		})
		.catch(models.Sequelize.ForeignKeyError, error.handleForeign(req, res, {
			costItemId: 'Такой статьи не существует',
			periodId: 'Такого периода не существует'
		}))
		.catch(models.Sequelize.UniqueConstraintError, error.handleUnique(req, res, {
			estimateId_costItemId: 'В смете уже есть такая статья'
			// todo: первичный ключ?
		}))
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};