'use strict';

const Sequelize = require('sequelize');

module.exports = function (sq, DataTypes) {
	return sq.define('PeriodType',
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true
			},
			name: {
				type: DataTypes.STRING(20),
				allowNull: false,
				validate: {
					is: {
						args: /^[а-яё/w/d\- ]{1,20}$/i,
						msg: 'Недопустимое название динамики периодов'
					},
					not: {
						args: /^\s+$/,
						msg: 'Название динамики не должно состоять из одних пробелов'
					}
				}
			},
			length: {
				type: DataTypes.INTEGER(2),
				allowNull: false,
				defaultValue: 0,
				/*validate: {
					max: {
						args: numPeriods - 1,
						msg: 'Номер периода превышает максимальный'
					}
				}*/
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			enableLog: true,
			classMethods: {
				associate: models => {
					models.PeriodType.hasMany(models.Period, { as: 'periods', foreignKey: 'typeId' });
				}
			},
			instanceMethods: {
			}
		});
};
