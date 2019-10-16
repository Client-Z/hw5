const mongoose = require('mongoose')

// TODO: move to .env file
const user = 'denis'
const psw = 'FtbBNQrjpihG5brY'
const dbName = 'denis'

const connectionStr = `mongodb+srv://${user}:${psw}@mentorship-ugbfr.gcp.mongodb.net/${dbName}?retryWrites=true&w=majority`

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

module.exports = MDatabase
