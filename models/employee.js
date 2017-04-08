'use strict';

const Sequelize = require('sequelize');

module.exports = function (sq, DataTypes) {
	return sq.define('Employee',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true
			},
			fullName: {
				type: DataTypes.STRING(300),
				allowNull: false,
				validate: {
					not: {
						args: /^\s*$/i,
						msg: 'ФИО не может состоять из одних пробелов'
					},
					is: {
						args: /[а-яё\w\- ]+/i,
						msg: 'ФИО может состоять из букв, дефисов и пробелов'
					}
				}
			},
			sex: {
				type: DataTypes.BOOLEAN,
				allowNull: false
			},
			birthDate: {
				type: DataTypes.DATEONLY,
				allowNull: false
			}
		}, {
			freezeTableName: true,
			timestamps: true,
			indexes: [
				{
					name: 'Employee_createdAt',
					fields: ['createdAt']
				}
			],
			classMethods: {
				associate: models => {
					models.Employee.hasOne(models.User, { as: 'user', foreignKey: 'employeeId' });
					models.Employee.belongsToMany(models.Department, { through: 'EmployeeDepartment', foreignKey: 'employeeId' });
					models.Employee.hasMany(models.Request, { as: 'requests', foreignKey: 'requesterId' });
				}
			},
			instanceMethods: {
			}
		});
};