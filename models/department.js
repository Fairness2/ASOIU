﻿'use strict';

const Sequelize = require('sequelize');

module.exports = function (sq, DataTypes) {
	return sq.define('Department',
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true
			},
			fullName: {
				type: DataTypes.STRING(200),
				allowNull: false,
				validate: {
					is: {
						args: /^[а-яё/w/d\- ]{1,200}$/i,
						msg: 'Недопустимое название подразделения'
					},
					not: {
						args: /^\s+$/,
						msg: 'Название подразделения не долно состоять из одних пробелов'
					}
				}
			},
			shortName: {
				type: DataTypes.STRING(50),
				allowNull: false,
				validate: {
					is: {
						args: /^[а-яё/w/d\- ]{1,50}$/i,
						msg: 'Недопустимое название подразделения'
					},
					not: {
						args: /^\s+$/,
						msg: 'Название подразделения не долно состоять из одних пробелов'
					}
				}
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			classMethods: {
				associate: models => {
					models.Department.belongsToMany(models.Employee, { through: 'EmployeeDepartment', foreignKey: 'departmentId' });
				}
			},
			instanceMethods: {
			}
		});
};