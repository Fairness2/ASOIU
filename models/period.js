'use strict';

const Sequelize = require('sequelize');

const numPeriods = 12; // = месяцев в нашем календаре

module.exports = function (sq, DataTypes) {
	return sq.define('Period',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true
			},
			typeId: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING(20),
				allowNull: false,
				validate: {
					is: {
						args: /^[а-яё/w/d\- ]{1,20}$/i,
						msg: 'Недопустимое название периода'
					},
					not: {
						args: /^\s+$/,
						msg: 'Название периода не долно состоять из одних пробелов'
					}
				}
			},
			number: {
				type: DataTypes.INTEGER(2),
				allowNull: false,
				defaultValue: 0,
				validate: {
					max: {
						args: numPeriods - 1,
						msg: 'Номер периода превышает максимальный'
					}
				}
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			enableLog: true,
			indexes: [
				{ fields: ['typeId'] },
				{ fields: ['typeId', 'number'], unique: true }
			],
			classMethods: {
				associate: models => {
					models.Period.belongsTo(models.PeriodType, { as: 'type', foreignKey: 'typeId' });
					models.Period.hasMany(models.RequestItem, { as: 'requestItems', foreignKey: 'periodId' });
					models.Period.hasMany(models.CurrentRequest, { as: 'currentRequests', foreignKey: 'periodId' });
					models.Period.hasMany(models.EstimateItemValue, { as: 'estimateItemValues', foreignKey: 'periodId' });
					models.Period.hasMany(models.Limit, { as: 'limits', foreignKey: 'periodId' });
					models.Period.hasMany(models.Expense, { as: 'expenses', foreignKey: 'periodId' });
				}
			},
			instanceMethods: {
			}
		});
};