'use strict';

const _ = require('lodash');

function getPK(model, instance) {
	let pks = {};

	_.forEach(model.attributes, (attr, name) => {
		if (attr.primaryKey) pks[name] = instance[name];
	});

	return pks;
};

function removeIgnored(object, members) {
	_.forEach(members, name => {
		delete object[name]
	});

	return object;
}

module.exports = function (options) {
	return {
		options: options,
		enable: function (model) {
			model.afterCreate('auditCreate', function (instance, options) {
				console.log(this);

				return model.sequelize.models.Log.create({
					userId: options.context.user.id,
					model: model.name,
					rowId: getPK(model, instance),
					action: 'create',
					diff: {
						new: removeIgnored(instance.toJSON(), options.ignore)
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
						old: removeIgnored(instance.previous(), options.ignore),
						new: removeIgnored(instance.changed(), options.ignore)
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
						old: removeIgnored(instance.previous(), options.ignore)
					}
				});
			});
		}
	};
};