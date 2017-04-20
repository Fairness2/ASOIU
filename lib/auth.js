'use strict';

const _ = require('lodash');

// Функция-помежуточный слой для проверки на наличие корректной сессии пользователя
// В общем слечае кроме простой проверки сессии надо лезть в базу за набором прав
exports.authenticate = function (req, res, next) {
	if (req.session.user)
		next();
	else {
		res.status(401).json({
			errors: ['Не авторизован']
		});
	}
};

exports.check = function (...required) {
	return function (req, res, next) {
		if (req.session.user && (!required || _.every(required, perm => _.includes(req.session.user.permissions, perm))))
			next();
		else
			res.status(401).json({
				errors: ['Не авторизован']
			});
	};
};