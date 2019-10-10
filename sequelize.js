const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'mysql',
	logging: console.log,
	benchmark: true
})

module.exports = sequelize
