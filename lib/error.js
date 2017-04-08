'use strict';

exports.handleValidation = function (req, res) {
	return function (err) {
		let response = {
			errors: (typeof err.errors === 'array') ? err.errors.map(item => ({
				path: item.path,
				message: item.message
			})) : [err.message]
			, err: err
		};
		
		res.status(200).json(response);
	};
};

exports.handleUnique = function (req, res, msgs) {
	return function (err) {
		// Формат имени ограничения в БД должен быть [table]_[field] или [table]_[field]_key
		let field = err.original.constraint.match(/^[^_]+_([^_]+)/)[1];
		
		res.status(200).json({
			errors: [{
				path: field,
				message: msgs[field] || err.message
			}]
			, err: err
		});
	};
};

exports.handleForeignKey = function (req, res, msgs) {
	return function (err) {
		const field = err.original.constraint.match(/^[^_]+_([^_]+)_fkey$/)[1];
		
		res.status(200).json({
			errors: [{
				path: field,
				message: msgs[field] || err.message
			}]
			, err: err
		});
	};
};

exports.handleInternal = function (req, res) {
	return function (err) {
		res.status(500).json({
			errors: ['Упс. Что-то пошло не так :С']
			//, err: err
		});

		console.log(err);
	};
};