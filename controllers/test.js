'use strict';

const _ = require('lodash');
const moment = require('moment');
const error = require(__libdir + '/error.js');
const page = require(__libdir + '/page.js');
const models = require(__rootdir + '/models');

exports.setup = function (req, res) {
	Promise.all(_.map([
		'user',
		'user.list',
		'user.info',
		'user.set-roles'
	], name => models.Permission.findOrCreate({
		where: {name: name },
		defaults: { name: name }
	})))
		.then(perms =>
			models.Role.findOrCreate({
				where: {
					name: 'Администратор'
				},
				defaults: {
					name: 'Администратор',
					permissions: perms.map(x => x[0])
				}
			}))
		.then(([role, created]) => {
			return models.User
				.findById(req.session.user && req.session.user.id || req.params.id)
				.then(user => {
					if (user) {
						user.addRole(role);
						return user.save();
					}
				})
				.then(u => {
					res.status(200).json({
						data: role.id
					});
				});
		})
		.catch(error.handleInternal(req, res));
};