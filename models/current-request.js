'use strict';

const moment = require('moment');
const Sequelize = require('sequelize');

module.exports = function (sq, DataTypes) {
	return sq.define('CurrentRequest',
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
			requestId: {
				type: DataTypes.UUID,
				allowNull: false
			},
			periodId: {
				type: DataTypes.UUID,
				allowNull: false
			},
			year: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: () => moment().year(), //текущий год
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
			timestamps: false,
			enableLog: true,
			indexes: [
				{ fields: ['requestId'] },
				{ fields: ['periodId'] },
				{ fields: ['number'], /*name: 'CurrentRequest_number',*/ unique: true }
			],
			classMethods: {
				associate: models => {
					models.CurrentRequest.belongsTo(models.Request, { as: 'request', foreignKey: 'requestId' });
					models.CurrentRequest.belongsTo(models.Period, { as: 'period', foreignKey: 'periodId' });
					models.CurrentRequest.hasMany(models.CurrentRequestItem, { as: 'items', foreignKey: 'currentRequestId' });
				}
			},
			instanceMethods: {
			}
		});
};