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
			number: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				allowNull: false
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
					min: {
						args: 2000,
						msg: 'Год должен быть не ранее 2000'
					}
				}
			}
		}, {
			freezeTableName: true,
			timestamps: true,
			enableLog: true,
			indexes: [
				{ fields: ['requesterId'] },
				{ fields: ['number'], /*name: 'Request_number',*/ unique: true }
			],
			classMethods: {
				associate: models => {
					models.Request.hasMany(models.RequestItem, { as: 'items', foreignKey: 'requestId', onDelete: 'cascade' });
					models.Request.hasMany(models.CurrentRequest, { as: 'currentRequests', foreignKey: 'requestId' });
					models.Request.belongsTo(models.Employee, { as: 'requester', foreignKey: 'requesterId' });
					models.Request.belongsToMany(models.Estimate, { as: 'estimates', through: 'RequestEstimate', foreignKey: 'requestId' });
				}
			},
			instanceMethods: {
			}
		});
};