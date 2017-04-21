'use strict';

const Sequelize = require('sequelize');

module.exports = function (sq, DataTypes) {
	return sq.define('RequestItem',
		{
			requestId: {
				type: DataTypes.UUID,
				primaryKey: true
			},
			productId: {
				type: DataTypes.UUID,
				primaryKey: true
			},
			periodId: {
				type: DataTypes.UUID,
				primaryKey: true
			},
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
				validate: {
					min: {
						args: 1,
						msg: 'Минимальное количество - 1'
					},
					max: {
						args: 1000000000,
						msg: 'Слишком много'
					}
				}
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			enableLog: true,
			indexes: [
				{ fields: ['requestId'] }
			],
			classMethods: {
				associate: models => {
					models.RequestItem.belongsTo(models.Request, { as: 'request', foreignKey: 'requestId' });
					models.RequestItem.belongsTo(models.Product, { as: 'product', foreignKey: 'productId' });
					models.RequestItem.belongsTo(models.Period, { as: 'period', foreignKey: 'periodId' });
				}
			},
			instanceMethods: {
			}
		});
};