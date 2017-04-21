'use strict';

const models = require(__rootdir + '/models');
const page = require(__libdir + '/page.js');
const assoc = require(__libdir + '/assoc.js');
const error = require(__libdir + '/error.js');
const _ = require('lodash');

exports.create = function (req, res) {
	if (!error.require(res, req.body, {
		fullName: 'Необходимо указать ФИО сотрудника',
		sex: 'Необходимо указать пол сотрудника',
		birthDate: 'Необходимо указать дату рождения сотрудника'
	})) return;

	// если указаны подразделения, ищем их, если нет, то возвращаем пусто
	(req.body.departments ?
		models.Department.findAll({
			where: {
				id: { $in: req.body.departments }
			}
		})
		: Promise.resolve([]))
		.then(deps => {
			if (deps.length === _.uniq(req.body.departments || []).length)
				return models.Employee
					.create({
						fullName: req.body.fullName,
						sex: req.body.sex,
						birthDate: req.body.birthDate,
						departments: deps
					}, {
						context: req.session,
						include: assoc.deduceInclude(models.Employee, 'departments')
					})
					.then(emp => {
						res.status(200).json({
							data: emp.id // можно полагать, что empl всегда не null
						});
					})
			else
				res.status(200).json({
					errors: ['Некоторых указанных подразделений не существует']
				});
		})
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));
};

exports.update = function (req, res) {
	if (!error.require(res, req.body, {
		id: 'Тебуется указать сотрудника'
	})) return;

	Promise.all([
		models.Employee.findById(req.body.id),
		models.Department.findAll({
			where: {
				id: { $in: req.body.departments }
			}
		})])
		.then(([emp, deps]) => {
			if (!emp) {
				res.status(200).json({
					errors: ['Указанный сотрудник не был найден']
				});
				return;
			}

			if (deps.length < _.uniq(req.body.departments || []).length) {
				res.status(200).json({
					errors: ['Некоторых указанных подразделений не существует']
				});
				return;
			}

			emp.set({
				fullName: req.body.fullName,
				sex: req.body.sex,
				birthDate: req.body.birthDate
			});

			emp.setDepartments(deps, {
				context: req.session
			});

			return emp
				.save({
					context: req.session
				})
				.then(() => {
					res.status(200).json({
						data: 'ok'
					});
				});

		})
		.catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
		.catch(error.handleInternal(req, res));

	// обновить подразделения?
};

exports.list = function (req, res) {
	let {options, invert} = page.get('createdAt', req.query);

	if (req.query.id)
		options.where.id = req.query.id;

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

exports.single = function (req, res) {
	models.Employee
		.findById(req.params.id,
		{ include: assoc.deduceInclude(models.Employee, 'departments') })
		.then(emp => {
			if (emp)
				res.status(200).json({
					data: emp.toJSON()
				});
			else
				res.status(200).json({
					errors: ['Не найден']
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
				emp.setDepartments(deps, { context: req.session });

				return emp.save({ context: req.session })
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