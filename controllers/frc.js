﻿'use strict';

const _ = require('lodash');
const error = require(__libdir + '/error.js');
const page = require(__libdir + '/page.js');
const assoc = require(__libdir + '/assoc.js');
const models = require(__rootdir + '/models');

exports.create = function (req, res) {
	/*if (!error.require(res, req.body, {
		name: 'Необходимо название'
	})) return;*/

	models.FRC
		.create({
			name: req.body.name
		}, { context: req.session })
		.then(frc => {
			res.status(200).json({
				data: frc.id
			});
		})
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.update = function (req, res) {
	if (!error.require(res, req.body, {
		id: 'Тебуется указать сотрудника',
		name: 'Необходимо название'
	})) return;

	models.FRC
		.update({
			name: req.body.name
		}, {
			where: {
				id: req.body.id
			},
			context: req.session,
			individualHooks: true
		})
		.then((count, rows) => {
			if (count) {
				res.status(200).json({
					data: 'ok'
				});
			} else {
				res.status(200).json({
					errors: ['Указанный ЦФО не был найден']
				});
			}
		})
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.list = function (req, res) {
	let {options, invert} = page.get('id', req.query);

	if (req.query.id)
		options.where.id = req.query.id;

	models.FRC
		.findAll(options)
		.then(frcs => {
			let arr = _.map(frcs, x => x.toJSON());
			if (invert) arr.reverse();

			res.status(200).json({
				data: arr
			});
		})
		.catch(error.handleInternal(req, res));
};

exports.single = function (req, res) {
	models.FRC
		.findById(req.params.id, {
			include: req.query.with ? assoc.deduceInclude(models.FRC, {
				costItems: req.query.with['cost-item'],
				estimates: req.query.with['estimate']
			}) : null
		})
		.then(frc => {
			res.status(200).json({
				data: frc
			});
		})
		.catch(error.handleInternal(req, res));
};