'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('articles', 'picture').then(() => {
			queryInterface.addColumn('articles', 'picture', { type: Sequelize.STRING, allowNull: true })
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('articles', 'picture', { type: Sequelize.STRING, allowNull: true })
	}
}
