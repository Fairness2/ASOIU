'use strict';

const Sequelize = require('sequelize');

module.exports = function (sq, DataTypes) {
	return sq.define('Product',
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
			name: {
				type: DataTypes.STRING(50),
				allowNull: false,
				validate: {
					is: {
						args: /^[а-яё\w\d_\-:. ]{4,50}$/i,
						msg: 'Недопустимое название товара/услуги'
					}
				}
			},
			price: {
				type: DataTypes.DECIMAL(15, 2),
				allowNull: false,
				defaultValue: 0,
				validate: {
					min: {
						args: 0,
						msg: 'Цена не может быть отрицательной'
					}
				}
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			enableLog: true,
			indexes: [
				{ fields: ['costItemId'] }
			],
			classMethods: {
				associate: models => {
					models.Product.belongsTo(models.CostItem, { as: 'costItem', foreignKey: 'costItemId' });
					models.Product.hasMany(models.RequestItem, { as: 'requestItems', foreignKey: 'productId' });
					models.Product.hasMany(models.CurrentRequestItem, { as: 'currentRequestItems', foreignKey: 'productId' });
				}
			},
			instanceMethods: {
			}
		});
};