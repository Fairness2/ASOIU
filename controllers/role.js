'use strict';

const _ = require('lodash');
const error = require(__libdir + '/error.js');
const page = require(__libdir + '/page.js');
const assoc = require(__libdir + '/assoc.js');
const models = require(__rootdir + '/models');

exports.create = function (req, res) {
	models.Role
		.create({
			name: req.body.name
		})
		.then(role => {
			res.status(200).json({
				data: role.id
			});
		})
		.catch(models.Sequelize.UniqueConstraintError, error.handleUnique(req, res, {
			name: 'Роль с таким названием уже существует'
		}))
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.update = function (req, res) {
	if (!error.require(res, req.body, {
		id: 'Тебуется указать роль'
	})) return;

	models.Role
		.update({
			name: req.body.name
		}, { where: { id: req.body.id } })
		.then((count, rows) => {
			if (count) {
				res.status(200).json({
					data: 'ok'
				});
			} else {
				res.status(200).json({
					errors: ['Указанная роль не была найдена']
				});
			}
		})
		.catch(models.Sequelize.UniqueConstraintError, error.handleUnique(req, res, {
			name: 'Роль с таким названием уже существует'
		}))
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));

	// обновить подразделения?
};

exports.list = function (req, res) {
	let {options, invert} = page.get('name', req.query);

	options.include = assoc.deduceInclude(models.Role, 'permissions');

	models.Role
		.findAll(options)
		.then(roles => {
			let arr = roles.map(x => x.toJSON());
			if (invert) arr.reverse();

			res.status(200).json({
				data: arr
			});
		})
		.catch(error.handleInternal(req, res));
};

exports.permissions = function (req, res) {
	models.Role
		.findById(req.params.id, {
			include: assoc.deduceInclude(models.Role, 'permissions')
		})
		.then(role => {
			if (role) {
				res.status(200).json({
					data: role.permissions
				});
			} else {
				res.status(200).json({
					errors: ['Роль не найден']
				});
			}
		})
		.catch(error.handleInternal(req, res));
}

exports.setPermissions = function (req, res) {
	let ids = _.uniq(req.body.permissionIds);

	Promise
		.all([
			models.Role.findById(req.body.id),
			models.Permission.findAll({
				where: { id: { $in: ids } }
			})
		])
		.then(values => {
			let role = values[0];
			let perms = values[1];

			if (role && perms.length === ids.length) {
				role.setPermissions(perms);

				return role.save()
					.then(() => {
						res.status(200).json({
							data: 'ok'
						});
					});
			}

			let errors = [];
			if (!role) errors.push('Роль не найдена');
			if (perms.length < ids.length) errors.push('Указанных разрешений не существует');

			res.status(200).json({
				errors: errors
			});
		})
		.catch(error.handleInternal(req, res));
}