'use strict';

const _ = require('lodash');

exports.handleValidation = function (req, res) {
	return function (err) {
		let response = {
			errors: _.isArray(err.errors) ? err.errors.map(item => ({
				path: item.path,
				message: item.message
			})) : [err.message]
			, err: err
		};
		
		res.status(200).json(response);
	};
};

// генерирует имя ограничения 
function makeConstraintName(modelName, fields) {
	return modelName + (fields ? '_' + (_.isArray(fields) ? _.join(fields, '_') : fields) : '');
}

// генерирует имя индекса по правилам постреса
function makeIndexName(modelName, fields) {
	return _.snakeCase(makeConstraintName(modelName, fields));
}

// генерирует имя уникального ограничения
function makeUniqueKeyName(modelName, fields) {
	return makeConstraintName(modelName, fields) + '_key';
}

// генерирует имя ограничения внешнего ключа
function maketForeignKeyName(modelName, fields) {
	return makeConstraintName(modelName, fields) + '_fkey';
}

// генерирует имя ограничения первичного ключа
function makePrimaryKeyName(modelName) {
	return _.snakeCase(modelName) + '_pkey';
}

function isUKName(name) {
	return name.endsWith('_key');
}

function isFKName(name) {
	return name.endsWith('_fkey');
}

function isPKName(name) {
	return name.endsWith('_pkey');
}

exports.handleUnique = function (req, res, msgs) {
	return function (err) {
		// Формат имени ограничения в БД должен быть [table]_[field] или [table]_[field]_key
		//let field = err.original.constraint.match(/^[^_]+_([^_]+)/)[1];
		let field = _.findKey(msgs, (val, key) =>
			err.original.constraint.startsWith(
				isUKName(err.original.constraint)				// Если ограничение создавалось в модели внутри определения поля,
					? makeConstraintName(err.original.table, key)	// то его имя сохранит регистр, укзаанный в модели, и в конец добавится суффкс
					: makeIndexName(err.original.table, key)		// Если как индекс, то имя будет в змеином регистре и без суффикса
			));
		
		res.status(200).json({
			errors: [{
				path: field,
				message: (msgs && msgs[field]) || err.message
			}]
			, err: err
		});
	};
};

exports.handleForeign = function (req, res, msgs) {
	return function (err) {
		//const field = err.original.constraint.match(/^[^_]+_([^_]+)_fkey$/)[1];
		const field = _.findKey(msgs, (val, key) => err.original.constraint.startsWith(makeConstraintName(err.original.table, key)));
		
		res.status(200).json({
			errors: [{
				path: field,
				message: (msgs && msgs[field]) || err.message
			}]
			, err: err
		});
	};
};

exports.handlePrimary = function (req, res, msgs) {
	return function (err) {
		const field = _.findKey(msgs, (val, key) => err.original.constraint.startsWith(makePrimaryKeyName(key)));
		
		res.status(200).json({
			errors: [{
				path: field,
				message: (msgs && msgs[field]) || err.message
			}]
			, err: err
		});
	};
};

exports.handleInternal = function (req, res) {
	return function (err) {
		res.status(500).json({
			errors: ['Упс. Что-то пошло не так :С']
			, err: err
		});

		console.log(err);
	};
};

exports.require = function (res, object, checks, sendValue) {
	let errors = [];

	// проверяем существование поля в объекте, либо совпадение типа
	// checks: { сообщение | [тип | функция, сообщение] }
	_.forEach(checks, (val, key) => {
		if (
			_.isArray(val)
			&& (
				_.isString(val[0]) && typeof object[key] !== val[0]
				|| _.isFunction(val[0]) && !val[0](object[key])
			)
		) {
			errors.push({
				path: key,
				message: val[1],
				value: sendValue ? object : null
			});
		} else if (!object[key]) {
			errors.push({
				path: key,
				message: val,
				value: sendValue ? object : null
			});
		}
	});

	if (errors.length) {
		res.status(400).json({
			errors: errors
		});

		return false;
	}

	return true;
};