const { Model, DataTypes } = require('sequelize')
const sequelize = require('../dbConnection')

class Comments extends Model {}

Comments.init(
	{
		id: {
			type: DataTypes.INTEGER,
			unique: true,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		content: {
			type: DataTypes.STRING,
			allowNull: false
		},
		authorId: {
			type: DataTypes.INTEGER,
			field: 'author_id'
		},
		articleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: 'article_id'
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: false,
			field: 'created_at'
		}
	},
	{
		sequelize,
		timestamps: false,
		modelName: 'comments'
	}
)

Comments.associate = models => {
	Comments.belongsTo(models.Users, { as: 'author', foreignKey: 'authorId' })
	Comments.belongsTo(models.Articles, { as: 'article', foreignKey: 'articleId' })
}

module.exports = Comments
