'use strict';

const Sequelize = require('sequelize');

module.exports = function (sq, DataTypes) {
	return sq.define('Role',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true
			},
			name: {
				type: DataTypes.STRING(40),
				allowNull: false,
				validate: {
					is: {
						args: /^[а-яё\w\d_\-:. ]{4,40}$/i,
						msg: 'Недопустимое имя роли'
					}
				},
				unique: true
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			enableLog: true,
			classMethods: {
				associate: models => {
					models.Role.belongsToMany(models.User, { through: 'UserRole', as: 'users', foreignKey: 'roleId' });
					models.Role.belongsToMany(models.Permission, { through: 'RolePermission', as: 'permissions', foreignKey: 'roleId' });
				}
			},
			instanceMethods: {
			}
		});
};