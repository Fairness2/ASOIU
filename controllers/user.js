'use strict';

//const passport = require('passport');
const models = require(__rootdir + '/models');
const error = require(__libdir + '/error.js');
const Sequelize = models.Sequelize;
const User = models.User;

exports.register = (req, res) => {
	let user = User.build({
		username: req.body.username,
		employeeId: req.body.employeeId
	});

	Promise.try(() => { User.validatePassword(req.body.password); })
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
		.catch(Sequelize.ForeignKeyConstraintError, error.handleForeignKey(req, res, {
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
	
	User.findOne({ username: req.body.username })
		.then(user => {
			if (user) {
				return user
					.verifyPassword(req.body.password)
					.then(ok => {
						if (ok) {
							req.session.user = { id: user.id };

							res.status(200).json({
								data: 'Вход выполнен успешно'
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
	User.findById(req.session.user.id)
		.then(user => {
			if (user) {
				res.status(200).json({
					data: user.toJSON()
				});
			} else throw new Error('Пользователь из сессии не найден');
		})
		.catch(error.handleInternal(req, res));
};
