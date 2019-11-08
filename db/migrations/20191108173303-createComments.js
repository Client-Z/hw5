'use strict'

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable(
			'comments',
			{
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				content: {
					type: Sequelize.STRING,
					allowNull: false
				},
				author_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'users',
						key: 'id'
					}
				},
				article_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'articles',
						key: 'id'
					},
					onUpdate: 'cascade',
					onDelete: 'cascade'
				},
				created_at: {
					type: Sequelize.DATE,
					allowNull: false
				}
			},
			{
				comment: 'The table for comments',
				logging: console.log
			}
		),
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('comments')
	}
}
