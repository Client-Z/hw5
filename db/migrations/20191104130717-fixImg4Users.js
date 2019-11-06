'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('users', 'picture').then(() => {
			queryInterface.addColumn('users', 'picture', { type: Sequelize.STRING, allowNull: true })
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('users', 'picture', { type: Sequelize.STRING, allowNull: true })
	}
}
