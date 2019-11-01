const { Model, DataTypes } = require('sequelize')
const sequelize = require('../dbConnection')

class Providers extends Model {}

Providers.init(
	{
		id: {
			type: DataTypes.INTEGER,
			unique: true,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: 'user_id'
		},
		provider: {
			type: DataTypes.STRING,
			allowNull: false
		},
		providerUserId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: 'provider_user_id'
		}
	},
	{
		sequelize,
		timestamps: false,
		modelName: 'oauth_accounts'
	}
)

Providers.associate = models => {
	Providers.belongsTo(models.Users, {
		as: 'user',
		foreignKey: 'userId'
	})
}

module.exports = Providers
