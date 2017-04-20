'use strict';

const config = require(__rootdir + '/config.json').auth;
const _ = require('lodash');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const assoc = require(__libdir + '/assoc.js');

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
				unique: true /*{ // Индексы и уникальные ограничения не поддерживают особые сообщения
					args: true,
					msg: 'Имя пользователя занято'
				}*/
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
					name: 'User_employeeId', // секвелайз переводит имя в змеиный_стиль, что очень усложняет определение поля
					fields: ['employeeId'],
					unique: true
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
				getPermissions: function (id) {
					return this.
						findOne({
							where: { id: id },
							include: assoc.deduceInclude(this, {
								roles: {
									permissions: true
								}
							})
						})
						.then(user => {
							if (!user) return;
							return _.union(_.map(user.roles, role => _.map(role.permission, perm => per.name)));
						});
				},
				associate: models => {
					models.User.belongsTo(models.Employee, { as: 'employee', foreignKey: 'employeeId' });
					models.User.belongsToMany(models.Role, { through: 'UserRole', as: 'roles', foreignKey: 'userId' });
					models.User.hasMany(models.Log, { as: 'log', foreignKey: 'userId' });
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