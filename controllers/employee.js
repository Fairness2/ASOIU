'use strict';

const models = require(__rootdir + '/models');

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
	}).catch(models.Sequelize.ValidationError, e => {
		res.status(200).json({
			errors: e.errors.map(item => ({
				path: item.path,
				message: item.message
			}))
		});
	});
}

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
	}).then((count, rows) => {
		if (count) {
			res.status(200).json({
				data: 'ok'
			});
		} else {
			res.status(200).json({
				errors: ['Указанный сотрудник не был найден']
			});
		}
	});

	// обновить подразделения?
}

exports.list = function (req, res) {
	let filter = {
		fullName: { $gt: req.query.after || '' }
	};
	
	models.Employee.findAll({
		where: filter,
		order: [
			['fullName', 'asc']
		],
		limit: req.query.limit || 10
	}).then(emps => {
		res.status(200).json({
			data: emps.map(x => x.toJSON())
		});
	});
}