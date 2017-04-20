'use strict';

const _ = require('lodash');

exports.get = function (field, query) {
	let filter = {};
	let order;
	let invertResult = false;

	//todo: Обобщить это страницевание
	if (query.after) {
		filter[field] = { $gt: query.after };
		order = [[field, 'asc']];
	} else if (query.before) {
		filter[field] = { $lt: query.before };
		order = [[field, 'desc']];
		invertResult = true;
	}

	let options = {
		where: filter,
		order: order
	};

	if (query.limit !== 'all')
		options.limit = query.limit || 10;

	return {
		options: options,
		invert: invertResult
	};
};
