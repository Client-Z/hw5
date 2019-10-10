'use strict'

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable(
			'users',
			{
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				first_name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				last_name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				email: {
					type: Sequelize.STRING,
					allowNull: false
				},
				password: {
					type: Sequelize.STRING,
					allowNull: false
				},
				created_at: {
					type: Sequelize.DATE,
					allowNull: false
				},
				updated_at: {
					type: Sequelize.DATE,
					allowNull: false
				}
			},
			{
				comment: 'The table for users', // comment for table
				logging: console.log
			}
		),
	down: (queryInterface, Sequelize) => {
		queryInterface.dropTable('users')
	}
}
