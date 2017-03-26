'use strict';

const Sequelize = require('sequelize');

module.exports = function (sq, DataTypes) {
	return sq.define('CostItem',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true
			},
			parentId: {
				type: DataTypes.UUID
			},
			frcId: {
				type: DataTypes.UUID,
				allowNull: false
			},
			name: {
				type: DataTypes.STRING(60),
				allowNull: false,
				validate: {
					is: {
						args: /^[а-яё\w\d_\-:. ]{4,60}$/i,
						msg: 'Недопустимое название статьи'
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
			indexes: [
				{ fields: 'parentId' },
				{ fields: 'frcId' }
			],
			classMethods: {
				associate: models => {
					models.CostItem.belongsTo(models.CostItem, { as: 'parent', foreignKey: 'parentId' });
					models.CostItem.belongsTo(models.FRC, { as: 'frc', foreignKey: 'frcId' });
					models.CostItem.hasMany(models.EstimateItem, { as: 'estimateItems', foreignKey: 'costItemId' });
					models.CostItem.hasMany(models.Product, { as: 'products', foreignKey: 'costItemId' });
					models.CostItem.hasMany(models.Limit, { as: 'limits', foreignKey: 'costItemId' });
					models.CostItem.hasMany(models.Expanse, { as: 'expenses', foreignKey: 'costItemId' });
				}
			},
			instanceMethods: {
			}
		});
};