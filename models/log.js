'use strict';

const Sequelize = require('sequelize');

module.exports = function (sq, DataTypes) {
	return sq.define('Log',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true
			},
			ts: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: Sequelize.NOW
			},
			userId: {
				type: DataTypes.UUID/*,
				allowNull: false*/
			},
			model: {
				type: DataTypes.STRING(40),
				allowNull: false
			},
			rowId: {
				type: DataTypes.JSON,
				allowNull: false
			},
			action: {
				type: DataTypes.ENUM('create', 'update', 'delete'),
				allowNull: false
			},
			diff: {
				type: DataTypes.JSON,
				allowNull: false
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			classMethods: {
				associate: models => {
					models.Log.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
				}
			},
			instanceMethods: {
			}
		});
};
