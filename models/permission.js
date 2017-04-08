'use strict';

const Sequelize = require('sequelize');

module.exports = function (sq, DataTypes) {
	return sq.define('Permission',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true
			},
			name: {
				type: DataTypes.STRING(40),
				allowNull: false,
				unique: true /*{
					args: true,
					msg: 'Разрешение с таким названием уже существует'
				}*/
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			classMethods: {
				associate: models => {
					models.Permission.belongsToMany(models.Role, { through: 'RolePermission', as: 'roles', foreignKey: 'permissionId' });
				}
			},
			instanceMethods: {
			}
		});
};