'use strict';

const Sequelize = require('sequelize');

module.exports = function (sq, DataTypes) {
	return sq.define('FRC',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true
			},
			name: {
				type: DataTypes.STRING(100),
				allowNull: false,
				validate: {
					is: {
						args: /^[а-яё\w\d_\-:. ]{4,100}$/i,
						msg: 'Недопустимое название ЦФО'
					}
				}
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			classMethods: {
				associate: models => {
					models.FRC.hasMany(models.Estimate, { as: 'estimates', foreignKey: 'frcId' });
					models.FRC.hasMany(models.CostItem, { as: 'costItems', foreignKey: 'frcId' });
				}
			},
			instanceMethods: {
			}
		});
};