'use strict';

const moment = require('moment');
const Sequelize = require('sequelize');

module.exports = function (sq, DataTypes) {
	return sq.define('Estimate',
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
			name: {
				type: DataTypes.STRING(50),
				allowNull: false,
				validate: {
					is: {
						args: /^[а-яё\w\d_\-:. ]{0,50}$/i,
						msg: 'Недопустимое название'
					}
				}
			},
			frcId: {
				type: DataTypes.UUID
			},
			year: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: () => moment().year() + 1 //следующий год
			},
			approvalDate: {
				type: DataTypes.DATEONLY
			}
		}, {
			freezeTableName: true,
			timestamps: true,
			indexes: [
				{ fields: ['frcId'] },
				{ fields: ['frcId', 'year'], where: { approvalDate: { $ne: null } }, unique: true },
				{ fields: ['year'], where: { approvalDate: { $ne: null }, frcId: null }, unique: true },
				{ fields: ['number'], /*name: 'Estimate_number',*/ unique: true }
			],
			classMethods: {
				associate: models => {
					models.Estimate.belongsTo(models.FRC, { as: 'frc', foreignKey: 'frcId' });
					models.Estimate.hasMany(models.EstimateItem, { as: 'items', foreignKey: 'estimateId' });
					models.Estimate.belongsToMany(models.Request, { through: 'RequestEstimate', foreignKey: 'estimateId' });
				}
			},
			instanceMethods: {
				// Вспомогательная функция, показывает, смета для предприятия (истина) или одного ЦФО (ложь)
				forCompany: function () {
					return this.frcId === null;
				}
			}
		});
};