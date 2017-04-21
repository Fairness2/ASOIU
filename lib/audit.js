'use strict';

const _ = require('lodash');
const jsdiff = require('diff');

function getPK(model, instance) {
	let pks = {};

	_.forEach(model.attributes, (attr, name) => {
		if (attr.primaryKey) pks[name] = instance[name];
	});

	return pks;
};

exports.enable = function (model) {
	model.afterCreate('auditCreate', function (instance, options) {
		console.log(this);

		return model.sequelize.models.Log.create({
			userId: options.context.user.id,
			model: model.name,
			rowId: getPK(model, instance),
			action: 'create',
			diff: {
				new: instance.toJSON()
			}
		});
	});

	model.afterUpdate('auditUpdate', function (instance, options) {
		console.log(this);

		return model.sequelize.models.Log.create({
			userId: options.context.user.id,
			model: model.name,
			rowId: getPK(model, instance),
			action: 'update',
			diff: {
				old: instance.previous(),
				new: instance.changed()
			}
		});
	});

	model.afterDestroy('auditDelete', function (instance, options) {
		console.log(this);

		return model.sequelize.models.Log.create({
			userId: options.context.user.id,
			model: model.name,
			rowId: getPK(model, instance),
			action: 'delete',
			diff: {
				old: instance.previous()
			}
		});
	});
};