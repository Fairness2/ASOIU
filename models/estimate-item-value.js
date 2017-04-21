'use strict';

const Sequelize = require('sequelize');

module.exports = function (sq, DataTypes) {
	return sq.define('EstimateItemValue',
		{
			estimateItemId: {
				type: DataTypes.UUID,
				primaryKey: true
			},
			periodId: {
				type: DataTypes.UUID,
				primaryKey: true
			},
			value: {
				type: DataTypes.DECIMAL(15,2),
				allowNull: false,
				defaultValue: 0,
				validate: {
					min: {
						args: 0.0,
						msg: 'Минимальная сумма - 0.00'
					}
				}
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			enableLog: true,
			indexes: [
				{ fields: ['estimateItemId'] }
			],
			classMethods: {
				associate: models => {
					models.EstimateItemValue.belongsTo(models.EstimateItem, { as: 'estimateItem', foreignKey: 'estimateItemId' });
					models.EstimateItemValue.belongsTo(models.Period, { as: 'period', foreignKey: 'periodId' });
				}
			},
			instanceMethods: {
			}
		});
};