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
		: _.keys(alias).map((key, val) => ({
			model: model.associations[key].target,
			as: key,
			include: _.isObject(val) ? deduceIncludes(model.associations[key].target, val)
		}));
}

exports.deduceInclude = deduceInclude;