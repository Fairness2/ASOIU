﻿'use strict';

const models = require(__rootdir + '/models');
const error = require(__libdir + '/error.js');
const _ = require('lodash');

exports.create = function (req, res) {
	if (!error.require(res, req.body, {
		fullName: 'Необходимо указать ФИО сотрудника',
		sex: 'Необходимо указать пол сотрудника',
		birthDate: 'Необходимо указать дату рождения сотрудника'
	})) return;

	models.Employee
		.create({
			fullName: req.body.fullName,
			sex: req.body.sex,
			birthDate: req.body.birthDate
			/* подразделения? */
		})
		.then(emp => {
			res.status(200).json({
				data: emp.id // можно полагать, что empl всегда не null
			});
		})
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.update = function (req, res) {
	if (!error.require(res, req.body, {
		id: 'Тебуется указать сотрудника'
	})) return;

	models.Employee
		.update({
			fullName: req.body.fullName,
			sex: req.body.sex,
			birthDate: req.body.birthDate
		}, {
			where: {
				id: req.body.id
			}
		})
		.then((count, rows) => {
			if (count) {
				res.status(200).json({
					data: 'ok'
				});
			} else {
				res.status(200).json({
					errors: ['Указанный сотрудник не был найден']
				});
			}
		})
		.catch(error.handleInternal(req, res));

	// обновить подразделения?
};

exports.list = function (req, res) {
	let {options, invert} = page.get('cratedAt', req.query);

	models.Employee
		.findAll(options)
		.then(emps => {
			let arr = emps.map(x => x.toJSON());
			if (invert) arr.reverse();

			res.status(200).json({
				data: arr
			});
		})
		.catch(error.handleInternal(req, res));
};

exports.departments = function (req, res) {
	models.Employee
		.findById(req.params.id, {
			include: assoc.deduceInclude(models.Employee, 'departments')
		})
		.then(emp => {
			if (emp) {
				res.status(200).json({
					data: emp.departments.map(x => x.toJSON())
				});
			} else {
				res.status(200).json({
					errors: ['Сотрудник не найден']
				});
			}
		})
		.catch(error.handleInternal(req, res));
}

exports.setDepartments = function (req, res) {
	let ids = _.uniq(req.body.departmentIds);

	Promise.all([
		models.Employee.findById(req.body.id),
		models.Department.findAll({
			where: { id: { $in: ids } }
		})])
		.then(([emp, deps]) => {
			if (emp && deps.length === ids.length) {
				emp.setDepartments(deps);

				return emp.save()
					.then(() => {
						res.status(200).json({
							data: 'ok'
						});
					});
			}

			let errors = [];
			if (!emp) errors.push('Сотрудник не найден');
			if (deps.length < ids.length) errors.push('Указанных подразделений не существует');

			res.status(200).json({
				errors: errors
			});
		})
		.catch(error.handleInternal(req, res));
}