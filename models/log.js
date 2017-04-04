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
			userId: {
				type: DataTypes.UUID,
				allowNull: false
			},
			ts: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: Sequelize.NOW
			},
			object: {
				type: DataTypes.STRING(40),
				allowNull: false
			},
			row: {
				type: DataTypes.STRING(60),
				allowNull: false
			},
			attrib: {
				type: DataTypes.STRING(40),
				allowNull: false
			},
			action: {
				type: DataTypes.ENUM('insert', 'update', 'delete'),
				allowNull: false
			},
			old: {
				type: DataTypes.STRING(300)
			},
			new: {
				type: DataTypes.STRING(300)
			},
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
