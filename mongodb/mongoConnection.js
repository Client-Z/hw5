const mongoose = require('mongoose')

const connectionStr = process.env.CONNECTION_STR

// connection
class MDatabase {
	static async connect() {
		try {
			return mongoose.connect(connectionStr, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				replicaSet: 'mentorship-shard-0'
			})
		} catch (e) {
			throw e
		}
	}
}
MDatabase.connect()
module.exports = connectionStr
