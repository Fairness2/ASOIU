'use strict';

const _ = require('lodash');
const moment = require('moment');
const error = require(__libdir + '/error.js');
const page = require(__libdir + '/page.js');
const models = require(__rootdir + '/models');

const permissions = [
	'user',
	'user.list',
	'user.info',
	'user.set-roles',
	'user.update',
	'user.register',

	'role.list',
	'role.create',
	'role.update',

	'ci.list',
	'ci.create',
	'ci.update',

	'cur-req.list',
	'cur-req.create',
	'cur-req.update',

	'dep.list',
	'dep.create',
	'dep.update',

	'empl.list',
	'empl.create',
	'empl.update',

	'est.list',
	'est-comp.create',
	'est-comp.update',
	'est-frc.create',
	'est-frc.update',

	'exp.list',
	'exp.create',

	'lim.list',
	'lim.create',

	'frc.list',
	'frc.create',
	'frc.update',

	'period.list',
	'period.create',
	'period.update',

	'ptype.list',
	'ptype.create',
	'ptype.update',

	'prod.list',
	'prod.create',
	'prod.update',

	'req.list',
	'req.create',
	'req.update'
];

// Создаёт отдел, сотрудника, пользователя (admin/admin), роль админа и права
exports.setup = function (req, res) {
	Promise.all([
		models.Department.findOrCreate({
			where: { fullName: 'Отдел 0' },
			defaults: {
				fullName: 'Отдел 0',
				shortName: 'О0'
			}
		}),
		models.Employee
			.create({
				fullName: 'Иванов Иван Иванович',
				sex: true,
				birthDate: '2000-01-01'
			}),
		models.User.findOne({
			where: { username: 'admin' }
		}),
		Promise.all(_.map(permissions, name => models.Permission.findOrCreate({
			where: { name: name },
			defaults: { name: name }
		}))),
		models.Role.findOrCreate({
			where: {
				name: 'Администратор'
			},
			defaults: {
				name: 'Администратор'
			}
		})
	])
		.then(([[dep], emp, user, perms, [role]]) => {
			return (user
				? Promise.resolve(user)
				: models.User // создаём пользователя
					.build({
						username: 'admin',
						employeeId: emp.id
					})
					.setPassword('admin')
					.then(() => user.save()))
				.then(user =>
					Promise.all([
						role.setPermissions(perms.map(x => x[0])),
						user.addRole(role)
							.then(() => user.save()),
						dep.addEmployee(user.employee)
					]))
				.then(() => {
					res.status(200).json({
						data: role.id
					});
				});
		})
		.catch(error.handleInternal(req, res));
};