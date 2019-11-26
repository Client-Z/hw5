require('dotenv').config({ path: process.cwd() + '/tests/.env' })
const clearDatabase = require('./clearDatabase')
const sequelize = require('../db/dbConnection')

module.exports = async () => {
	await sequelize.sync()
	await clearDatabase()
}
