'use strict'

module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.addColumn('users', 'is_verified', {
			type: Sequelize.BOOLEAN,
			allowNull: false
		})
	},

	down: function(queryInterface, Sequelize) {
		return queryInterface.removeColumn('users', 'is_verified')
	}
}
