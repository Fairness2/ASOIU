'use strict';

const Sequelize = require('sequelize');

module.exports = function (sq, DataTypes) {
	return sq.define('Expense',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true
			},
			costItemId: {
				type: DataTypes.UUID,
				allowNull: false
			},
			periodId: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			date: {
				type: DataTypes.DATEONLY,
				allowNull: false,
				defaultValue: Sequelize.NOW
			},
			value: {
				type: DataTypes.DECIMAL(15, 2),
				allowNull: false,
				validate: {
					not: {
						args: 0.0, // может быть отрицательным
						msg: 'Расход не должен быть нулевым'
					}
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
					models.Expense.belongsTo(models.CostItem, { as: 'costItem', foreignKey: 'costItemId' });
					models.Expense.belongsTo(models.Period, { as: 'period', foreignKey: 'periodId' });
				}
			},
			instanceMethods: {
			}
		});
};
