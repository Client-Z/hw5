'use strict'

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable(
			'oauth_accounts',
			{
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				provider: {
					type: Sequelize.STRING,
					allowNull: false
				},
				provider_user_id: {
					type: Sequelize.STRING,
					allowNull: false
				},
				user_id: {
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
				comment: 'The table for oauth providers',
				logging: console.log
			}
		),
	down: (queryInterface, Sequelize) => {
		queryInterface.dropTable('oauth_accounts')
	}
}
