'use strict'

module.exports = {
	up: function(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.addColumn('users', 'is_pro', {
				type: Sequelize.BOOLEAN,
				allowNull: true
			}),
			queryInterface.addColumn('users', 'stripe_customer_id', {
				type: Sequelize.STRING,
				allowNull: true
			}),
			queryInterface.addColumn('users', 'stripe_card_id', {
				type: Sequelize.STRING,
				allowNull: true
			})
		])
	},

	down: function(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.removeColumn('users', 'is_pro'),
			queryInterface.removeColumn('users', 'stripe_customer_id'),
			queryInterface.removeColumn('users', 'stripe_card_id')
		])
	}
}
