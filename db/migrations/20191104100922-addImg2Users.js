'use strict'

module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.addColumn('users', 'picture', {
			type: Sequelize.STRING,
			allowNull: true
		})
	},

	down: function(queryInterface, Sequelize) {
		return queryInterface.removeColumn('users', 'picture', {
			type: Sequelize.STRING,
			allowNull: true
		})
	}
}
