'use strict';

const config = require(__rootdir + '/config.json').auth;
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = function (sq, DataTypes) {
	return sq.define('User',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true
			},
			username: {
				type: DataTypes.STRING(50),
				allowNull: false,
				validate: {
					is: {
						args: /^[а-яё\w\d_\- :.]{4,50}$/i,
						msg: 'Недопустимое имя пользователя'
					}
				},
				unique: {
					args: true,
					msg: 'Имя пользователя занято'
				}
			},
			password: {
				type: DataTypes.CHAR(60),
				allowNull: false
			},
			employeeId: {
				type: DataTypes.UUID,
				allowNull: false
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			indexes: [
				{
					fields: ['employeeId'],
					unique: {
						args: true,
						msg: 'Сотрудник уже зарегистрирован как пользователь'
					}
				},
			],
			classMethods: {
				validatePassword: password => { // Проверить исходный пароль на запрещённые символы
					const path = 'password';
					let errors = [];

					if (password.length < 6) {
						errors.push(new Sequelize.ValidationErrorItem('Пароль слишком короткий', '', path, password.length));
					}

					if (Buffer.byteLength(password) > 72) {
						errors.push(new Sequelize.ValidationErrorItem('Пароль слишком длинный', '', path, password.length));
					}

					if (errors.length) throw new Sequelize.ValidationError('Validation error', errors);
				},
				associate: models => {
					models.User.belongsTo(models.Employee, { as: 'employee', foreignKey: 'employeeId' });
					models.User.belongsToMany(models.Role, { through: 'UserRole', /*as: 'roles', */foreignKey: 'userId' });
				}
			},
			instanceMethods: {
				verifyPassword: function (password) {
					return bcrypt.compare(password, this.password);
				},
				setPassword: function (password) {
					return bcrypt.hash(password, config.saltRounds)
						.then(hashed => {
							this.password = hashed;
						});
				},
				toJSON: function () {
					let inst = Object.assign({}, this.get());
					delete inst.password;
					return inst;
				}
			}
		});
};