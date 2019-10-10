'use strict'

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable(
			'articles',
			{
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				title: {
					type: Sequelize.STRING,
					allowNull: false
				},
				content: {
					type: Sequelize.STRING,
					allowNull: false
				},
				published_at: {
					type: Sequelize.DATE,
					allowNull: false
				},
				created_at: {
					type: Sequelize.DATE,
					allowNull: false
				},
				updated_at: {
					type: Sequelize.DATE,
					allowNull: false
				},
				author_id: {
					type: Sequelize.INTEGER,
					references: {
						model: 'users',
						key: 'id'
					},
					onUpdate: 'cascade',
					onDelete: 'cascade'
				}
			},
			{
				comment: 'The table for articles', // comment for table
				logging: console.log
			}
		),
	down: (queryInterface, Sequelize) => {
		queryInterface.dropTable('articles')
	}
}
