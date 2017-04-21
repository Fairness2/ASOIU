'use strict';

const _ = require('lodash');
const page = require(__libdir + '/page.js');
const error = require(__libdir + '/error.js');
const models = require(__rootdir + '/models');

exports.create = function (req, res) {
	models.Permission.create({
		name: req.body.name
	})
		.then(perm => {
			res.status(200).json({
				data: perm.id
			});
		})
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(models.Sequelize.UniqueConstraintError, error.handleUnique(req, res, {
			name: 'Разрешение уже существует'
		}))
		.catch(error.handleInternal(req, res));
};

exports.update = function (req, res) {
	if (!req.body.id) {
		res.status(400).json({
			errors: [{
				path: 'id',
				message: 'Тебуется указать разрешение'
			}]
		});

		return;
	}

	models.Permission.update({
		name: req.body.name
	}, { where: { id: req.body.id } })
		.then((count, rows) => {
			if (count) {
				res.status(200).json({
					data: 'ok'
				});
			} else {
				res.status(200).json({
					errors: ['Указанное разрешение не было найдено']
				});
			}
		})
		.catch(models.Sequelize.UniqueConstraintError, error.handleUnique(req, res, {
			name: 'Разрешение уже существует'
		}))
		.catch(error.handleInternal(req, res));
};

exports.list = function (req, res) {
	let { options, invert } = page.get('name', req.query);

	models.Permission.findAll(
		options
	).then(perms => {
		let arr = perms.map(x => x.toJSON());
		if (invert) arr.reverse();

		res.status(200).json({
			data: arr
		});
		})
		.catch(error.handleInternal(req, res));
};