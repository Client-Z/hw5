const { Model, DataTypes } = require('sequelize')
const sequelize = require('../dbConnection')
const { hashPassword } = require('../../services/hashPsw')

class Users extends Model {}

Users.init(
	{
		id: {
			type: DataTypes.INTEGER,
			unique: true,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'first_name'
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'last_name'
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'email'
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'password'
		},
		picture: {
			type: DataTypes.STRING
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: false,
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: false,
			field: 'updated_at'
		},
		isVerified: {
			type: DataTypes.BOOLEAN,
			defaultValue: 0,
			allowNull: false,
			field: 'is_verified'
		},
		is_pro: {
			type: DataTypes.BOOLEAN,
			defaultValue: 0,
			allowNull: false,
			field: 'is_pro'
		},
		stripe_customer_id: {
			type: DataTypes.BOOLEAN,
			defaultValue: null,
			allowNull: true,
			field: 'stripe_customer_id'
		},
		stripe_card_id: {
			type: DataTypes.BOOLEAN,
			defaultValue: null,
			allowNull: true,
			field: 'stripe_card_id'
		}
	},
	{
		sequelize,
		modelName: 'users',
		defaultScope: {
			attributes: { exclude: ['password'] }
		},
		hooks: {
			beforeCreate: hashPassword,
			beforeUpdate: hashPassword
		}
	}
)

Users.associate = models => {
	Users.hasMany(models.Articles, { as: 'articles', foreignKey: 'authorId' })
	Users.hasMany(models.Providers, { as: 'oauth_accounts', foreignKey: 'userId' })
	Users.hasMany(models.Comments, { as: 'comments', foreignKey: 'authorId' })
}

module.exports = Users
