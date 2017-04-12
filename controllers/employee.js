'use strict';

const models = require(__rootdir + '/models');
const error = require(__libdir + '/error.js');
const _ = require('lodash');

exports.create = function (req, res) {
	const errors = [];

	if (!req.body.fullName) {
		errors.push({
			path: 'fullName',
			message: 'Необходимо указать ФИО сотрудника'
		});
	}

	if (typeof req.body.sex !== 'boolean') {
		errors.push({
			path: 'sex',
			message: 'Необходимо указать пол сотрудника'
		});
	}

	if (!req.body.birthDate) {
		errors.push({
			path: 'birthDate',
			message: 'Необходимо указать дату рождения сотрудника'
		});
	}

	if (errors.length) {
		res.status(400).json({
			errors: errors
		});

		return;
	}

	models.Employee.create({
		fullName: req.body.fullName,
		sex: req.body.sex,
		birthDate: req.body.birthDate
		/* подразделения? */
	}).then(emp => {
	res.status(200).json({
		data: emp.id // можно полагать, что empl всегда не null
	});
	}).catch(models.Sequelize.ValidationError, error.handleValidation(req, res))
	.catch(error.handleInternal(req, res));
};

exports.update = function (req, res) {
	if (!req.body.id) {
		res.status(400).json({
			errors: [{
				path: 'id',
				message: 'Тебуется указать сотрудника'
			}]
		});

		return;
	}

	models.Employee.update({
		fullName: req.body.fullName,
		sex: req.body.sex,
		birthDate: req.body.birthDate
	}, {
		where: {
			id: req.body.id
		}
	})	.then((count, rows) => {
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
	let filter = {};
	let order = [];
	let invertResult = false;
	let field = 'createdAt';

	if (req.query.after) {
		filter[field] = { $gt: req.query.after };
		order.push((field, 'asc'));
	} else if (req.query.before) {
		// В запросе в базу делаем обратную сортировку,
		// клиенту отдаём в возрастающем порядке
		filter[field] = { $lt: req.query.before };
		order.push((field, 'desc'));
		invertResult = true;
	}

	models.Employee.findAll({
		where: filter,
		order: order,
		limit: req.query.limit || 10
	}).then(emps => {
		let arr = emps.map(x => x.toJSON());
		if (invertResult) arr.reverse();

		res.status(200).json({
			data: arr
		});
	}).catch(error.handleInternal(req, res));
};

exports.departments = function (req, res) {
	models.Employee.findById(req.params.id, {
		include: [{ model: models.Department, as: 'departments' }]
	}).then(emp => {
		if (emp) {
			res.status(200).json({
				data: emp.departments
			});
		} else {
			res.status(200).json({
				errors: ['Сотрудник не найден']
			});
		}
	}).catch(error.handleInternal(req, res));
}

exports.setDepartments = function (req, res) {
	let ids = _.uniq(req.body.departmentIds);

	Promise.all([
		models.Employee.findById(req.body.id),
		models.Department.findAll({
			where: { id: { $in: ids } }
		})])
		.then(values => {
			let emp = values[0];
			let deps = values[1];

			if (emp && deps.length===ids.length) {
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
		}).catch(error.handleInternal(req, res));
}