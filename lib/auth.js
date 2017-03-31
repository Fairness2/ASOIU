// Функция-помежуточный слой для проверки на наличие корректной сессии пользователя
// В общем слечае кроме простой проверки сессии надо лезть в базу за набором прав
function authenticate(req, res, next) {
	if (req.session.user)
		next();
	else {
		res.status(401).json({
			errors: ['Не авторизован']
		});
	}
};

exports.authenticate = authenticate;