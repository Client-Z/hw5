require('dotenv').config({ path: process.cwd() + '/.env' })

module.exports = {
	development: {
		url: process.env.DATABASE_URL,
		dialect: 'mysql'
	}
}
