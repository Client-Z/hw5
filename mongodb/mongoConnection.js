const mongoose = require('mongoose')

class MDatabase {
	static async connect() {
		try {
			return mongoose.connect(process.env.CONNECTION_STR, {
				useNewUrlParser: true,
				useUnifiedTopology: true
			})
		} catch (e) {
			throw e
		}
	}
}
MDatabase.connect()

module.exports = MDatabase
