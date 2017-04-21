'use strict';

const _ = require('lodash');

// Вытягивает данные из ассоциации модели по псеводниму
// используется в поисковых методах моделей, в массиве include
// alias: поле | { поле: true | {...}, ... }
function deduceInclude(model, alias) {
	return _.isString(alias) ?
		[{
			model: model.associations[alias].target,
			as: alias
		}]
		: _.isObject(alias) ?
			_.map(alias, (val, key) => ({
			model: model.associations[key].target,
			as: key,
			include: _.isObject(val) ? deduceInclude(model.associations[key].target, val) : null
		})): null;
}

exports.deduceInclude = deduceInclude;