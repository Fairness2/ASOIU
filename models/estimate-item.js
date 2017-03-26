'use strict';

const Sequelize = require('sequelize');

module.exports = function (sq, DataTypes) {
	return sq.define('EstimateItem',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true
			},
			estimateId: {
				type: DataTypes.UUID
			},
			costItemId: {
				type: DataTypes.UUID
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			indexes: [
				{
					fields: ['estimateId', 'costItemId'],
					unique: {
						args: true,
						msg: 'В смете уже есть такая статья'
					}
				}
			],
			classMethods: {
				associate: models => {
					models.EstimateItem.belongsTo(models.Estimate, { as: 'estimate', foreignKey: 'estimateId' });
					models.EstimateItem.belongsTo(models.CostItem, { as: 'costItem', foreignKey: 'costItemIdId' });
					models.EstimateItem.hasMany(models.EstimateItemValue, { as: 'values', foreignKey: 'estimateItemId' });
				}
			},
			instanceMethods: {
			}
		});
};