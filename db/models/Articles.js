const { Model, DataTypes } = require('sequelize')
const sequelize = require('../dbConnection')

class Articles extends Model {}

Articles.init(
	{
		id: {
			type: DataTypes.INTEGER,
			unique: true,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		content: {
			type: DataTypes.STRING,
			allowNull: false
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
		publishedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: false,
			field: 'published_at'
		},
		authorId: {
			type: DataTypes.INTEGER,
			field: 'author_id'
		}
	},
	{
		sequelize,
		modelName: 'articles'
	}
)

Articles.associate = models => {
	Articles.belongsTo(models.Users, {
		as: 'author',
		foreignKey: 'authorId'
	})
}

module.exports = Articles
