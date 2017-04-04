'use strict';

//const passport = require('passport');
const models = require(__rootdir + '/models');
const Sequelize = models.Sequelize;
const User = models.User;

function internalErrorHandler(err) {
	res.status(500).json({
		errors: {
			internal: 'Internal server error'
		}
	});

	console.log(err);
}

exports.register = (req, res) => {
	let user = User.build({ username: req.body.username });

	Promise.try(() => { User.validatePassword(req.body.password); })
		.then(user.setPassword.bind(user, req.body.password))
		.then(user.save.bind(user))
		.then(user => {
			res.status(200).json({
				data: 'ok' //todo: придумать что-то получше
			});
		})
		.catch(Sequelize.UniqueConstraintError, err => {
			res.status(200).json({
				errors: {
					username: 'Такое имя пользователя уже занято'
				}
			});
		})
		.catch(Sequelize.ValidationError, err => {
			let response = {
				errors: err.errors.map(item => ({
					path: item.path,
					message: item.message
				}))
			};

			res.status(200).json(response);
		})
		.catch(internalErrorHandler);
};

exports.login = (req, res) => {
	if (req.session.user) {
		res.status(400).json({
			errors: ['Вход уже выполнен']
		});

		return;
	}

	User.findOne({ username: req.body.username })
		.then(user => {
			const err = new Error('Неверное имя пользователя или пароль');

			if (user) {
				return user
					.verifyPassword(req.body.password)
					.then(ok => {
						if (ok) {
							req.session.user = { id: user.id };

							res.status(200).json({
								data: 'Вход выполнен успешно'
							});
						} else
							throw err;
					});
			} else
				throw err;
		})
		.catch(internalErrorHandler);
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
		.catch(internalErrorHandler);
};
