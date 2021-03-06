﻿'use strict';

//const passport = require('passport');
const _ = require('lodash');
const error = require(__libdir + '/error.js');
const page = require(__libdir + '/page.js');
const assoc = require(__libdir + '/assoc.js');
const models = require(__rootdir + '/models');
const Sequelize = models.Sequelize;
const User = models.User;

exports.register = (req, res) => {
	let user = User.build({
		username: req.body.username,
		employeeId: req.body.employeeId
	});

	Promise.try(() => User.validatePassword(req.body.password))
		.then(user.setPassword.bind(user, req.body.password))
		.then(user.save.bind(user))
		.then(user => {
			res.status(200).json({
				data: 'ok' //todo: придумать что-то получше
			});
		})
		.catch(Sequelize.UniqueConstraintError, error.handleUnique(req, res, {
			employeeId: 'Сотрудник уже зарегистрирован как пользователь',
			username: 'Имя пользователя занято'
		}))
		.catch(Sequelize.ForeignKeyConstraintError, error.handleForeign(req, res, {
			employeeId: 'Указанный сотрудник не найден'
		}))
		.catch(Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.update = (req, res) => {
	if (!error.require(res, req.body, {
		id: 'Требуется указать пользователя'
	})) return;

	let user = User.build();

	User.findById(req.body.id)
		.then(user => {
			if (!user) {
				res.status(200).json({
					errors: ['Пользователь не найден']
				});
				return;
			}

			user.set({
				username: req.body.username,
				employeeId: req.body.employeeId
			});

			return Promise
				.try(() => User.validatePassword(req.body.password))
				.then(user.setPassword.bind(user, req.body.password))
				.then(user.save.bind(user, {
					context: req.session,
					individualHooks: true
				}))
				.then(user => {
					res.status(200).json({
						data: 'ok' //todo: придумать что-то получше
					});
				});
		})
		.catch(Sequelize.UniqueConstraintError, error.handleUnique(req, res, {
			employeeId: 'Сотрудник уже зарегистрирован как пользователь',
			username: 'Имя пользователя занято'
		}))
		.catch(Sequelize.ForeignKeyConstraintError, error.handleForeign(req, res, {
			employeeId: 'Указанный сотрудник не найден'
		}))
		.catch(Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.login = (req, res) => {
	if (req.session.user) {
		res.status(200).json({
			errors: ['Вход уже выполнен']
		});

		return;
	}

	console.log(req.body.username);

	User
		.findOne({
			where: { username: req.body.username },
			include: assoc.deduceInclude(User, 'employee')
		})
		.then(user => {
			if (user) {
				return Promise.all([
					user.verifyPassword(req.body.password),
					User.getPermissions(user.id)
				])
					.then(([ok, perms]) => {
						if (ok) {
							req.session.user = user.toJSON();
							req.session.user.permissions = perms;

							res.status(200).json({
								data: user.toJSON()
							});

							return true;
						}

						return false;
					});
			}

			return false;
		})
		.then(ok => { // обработчик неудачного логина
			if (!ok) {
				res.status(200).json({
					errors: ['Неверное имя пользователя или пароль']
				});
			}
		})
		.catch(error.handleInternal(req, res));
};

// Средний слой должен проверить наличие сессии
exports.logout = (req, res) => {
	req.session.destroy(() => {
		res.status(200).json({
			data: 'Выход выполнен'
		});
	});
};

// Средний слой должен проверить наличие сессии
exports.info = (req, res) => {
	User.findById(req.params.id || req.session.user.id, {
		include: assoc.deduceInclude(User, 'roles')
	})
		.then(user => {
			if (user) {
				res.status(200).json({
					data: user.toJSON()
				});
			} else throw new Error('Пользователь из сессии не найден');
		})
		.catch(error.handleInternal(req, res));
};

exports.list = (req, res) => {
	let {options, invert} = page.get('id', req.query);

	options.include = assoc.deduceInclude(User, 'employee');

	User.findAll(options)
		.then(users => {
			let arr = _.map(users, x => x.toJSON());
			if (invert) arr.reverse();

			res.status(200).json({
				data: arr
			});
		})
		.catch(error.handleInternal(req, res));
};

exports.roles = (req, res) => {
	models.User
		.findById(req.params.id, {
			include: assoc.deduceInclude(models.User, 'roles')
		})
		.then(user => {
			if (user) {
				res.status(200).json({
					data: user.roles
				});
			} else {
				res.status(200).json({
					errors: ['Пользователь не найден']
				});
			}
		})
		.catch(error.handleInternal(req, res));
}

exports.setRoles = (req, res) => {
	const ids = _.uniq(req.body.roleIds);

	Promise.all([
		User.findById(req.body.id),
		models.Role.findMany({
			where: { $in: ids }
		})])
		.then(([user, roles]) => {
			if (user && roles.length === ids.length) {
				return user.setRoles(roles)
					.then(() => user.save())
					.then(() => {
						res.status(200).json({
							data: 'ok'
						});
					});
			}

			let errors = [];
			if (!user) errors.push('Пользователь не найден');
			if (roles.length < ids.length) errors.push('Указанных ролей не существует');

			res.status(200).json({
				errors: errors
			});
		})
		.catch(error.handleInternal(req, res));
}
