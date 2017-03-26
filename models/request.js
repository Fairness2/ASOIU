'use strict';

const moment = require('moment');
const Sequelize = require('sequelize');

module.exports = function (sq, DataTypes) {
	return sq.define('Request',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true
			},
			requesterId: {
				type: DataTypes.UUID,
				allowNull: false
			},
			year: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: () => moment().year() + 1, //следующий год
				validate: {
					// Если так делать, то надо различать создание и обновление
					/*isInFurute: (value) => {
						if (value < moment().year())
							throw new Error('Нельзя подать заявку на прошедший год');
					}*/
				}
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			indexes: [
				{ fields: 'requesterId' }
			],
			classMethods: {
				associate: models => {
					models.Request.hasMany(models.Employee, { as: 'requester', foreignKey: 'requesterId' });
					models.Request.hasMany(models.RequestItem, { as: 'items', foreignKey: 'requestId' });
					models.Request.hasMany(models.CurrentRequest, { as: 'currentRequests', foreignKey: 'requestId' });
					models.Request.belongsToMany(models.Estimate, { through: 'RequestEstimate', foreignKey: 'requestId' });
				}
			},
			instanceMethods: {
			}
		});
};