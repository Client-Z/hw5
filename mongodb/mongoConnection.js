const mongoose = require('mongoose')

const user = process.env.USER
const psw = process.env.PSW
const dbName = process.env.DB_NAME

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

module.exports = { MDatabase, connectionStr }
