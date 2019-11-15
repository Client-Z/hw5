'use strict'

module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.addColumn('articles', 'picture', {
			type: Sequelize.STRING,
			allowNull: true
		})
	},

	down: function(queryInterface, Sequelize) {
		return queryInterface.removeColumn('articles', 'picture')
	}
}
