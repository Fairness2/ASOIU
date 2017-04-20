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

	return {
		options: {
			filter: filter,
			order: order,
			limit: query.limit || 10
		},
		invert: invertResult
	};
};
