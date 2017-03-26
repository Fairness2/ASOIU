'use strict';

const Sequelize = require('sequelize');

module.exports = function (sq, DataTypes) {
	return sq.define('CurrentRequestItem',
		{
			currentRequestId: {
				type: DataTypes.UUID,
				primaryKey: true
			},
			productId: {
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
			indexes: [
				{ fields: 'currentRequestId' },
				{ fields: 'productId' }
			],
			classMethods: {
				associate: models => {
					models.CurrentRequestItem.belongsTo(models.CurrentRequest, { as: 'currentRequest', foreignKey: 'currentRequestId' });
					models.CurrentRequestItem.belongsTo(models.Product, { as: 'product', foreignKey: 'productId' });
				}
			},
			instanceMethods: {
			}
		});
};