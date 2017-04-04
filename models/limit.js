'use strict';

const Sequelize = require('sequelize');

module.exports = function (sq, DataTypes) {
	return sq.define('Limit',
		{
			costItemId: {
				type: DataTypes.UUID,
				primaryKey: true
			},
			periodId: {
				type: DataTypes.UUID,
				primaryKey: true
			},
			year: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				validate: {
					min: {
						args: 1970,
						msg: 'Года до 1970-го недопускаются'
					}
				}
			},
			total: {
				type: DataTypes.DECIMAL(15, 2),
				allowNull: false,
				validate: {
					min: {
						args: 0.01,
						msg: 'Сумма лимита должна быть положительна'
					}
				}
			},
			remain: {
				type: DataTypes.DECIMAL(15, 2),
				allowNull: false,
				defaultValue: 0.01,
				validate: {
					min: {
						args: 0,
						msg: 'Остаток не может быть отрицательным'
					}/*, // Остаток считается автоматом, расход может его увеличивать, и остаток может превысить начальную сумму
					customMax: function (value) {
						if (value > this.total)
							throw new Error('Остаток не модет превышать сумму лимита');
					}*/
				}
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			indexes: [
				{ fields: ['costItemId'] },
				{ fields: ['periodId'] }
			],
			classMethods: {
				associate: models => {
					models.Limit.belongsTo(models.CostItem, { as: 'costItem', foreignKey: 'costItemId' });
					models.Limit.belongsTo(models.Period, { as: 'period', foreignKey: 'periodId' });
				}
			},
			instanceMethods: {
			}
		});
};