'use strict';

const passport = require('passport');
const models = require(__rootdir + '/models');
const Sequelize = models.Sequelize;
const User = models.User;

exports.register = (req, res) => {
	let user = User.build({ name: req.body.username });
	
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
			/*let transforms = {
				name: item => 'invalid-username'
			};//*/

			let response = { errors: {} };

			// Формируем массив ошибок для каждого поля, преобразуя каждый ValidationErrorItem
			/*for (let item in err.errors) {
				response.errors[item.path] = item.message;
			}/**/

			response.errors = err.errors.map(item => ({
				path: item.path,
				message: item.message
			}));

			res.status(200).json(err);
		})
		.catch(err => {
			res.status(500).json({
				errors: {
					internal: 'Internal server error'
				}
			});
			console.log(err);
		});
};

exports.login = (req, res) => {
};

exports.logout = (req, res) => {
};

exports.info = (req, res) => {
};
