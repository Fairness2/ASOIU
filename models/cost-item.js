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
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			indexes: [
				{ fields: ['parentId'] },
				{ fields: ['frcId'] }
			],
			validate: {
				notCyclic: function () {
					if (this.id && this.id === this.parentId)
						throw new Error('Статья не может быть родителем самой себя');
				}
			},
			classMethods: {
				associate: models => {
					models.CostItem.belongsTo(models.CostItem, { as: 'parent', foreignKey: 'parentId' });
					models.CostItem.belongsTo(models.FRC, { as: 'frc', foreignKey: 'frcId' });
					models.CostItem.hasMany(models.EstimateItem, { as: 'estimateItems', foreignKey: 'costItemId' });
					models.CostItem.hasMany(models.Product, { as: 'products', foreignKey: 'costItemId' });
					models.CostItem.hasMany(models.Limit, { as: 'limits', foreignKey: 'costItemId' });
					models.CostItem.hasMany(models.Expense, { as: 'expenses', foreignKey: 'costItemId' });
				}
			},
			instanceMethods: {
			}
		});
};
