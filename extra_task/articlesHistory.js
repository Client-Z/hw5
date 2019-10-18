// const mongoose = require('mongoose')
// const { MDatabase: mdb } = require('../mongodb/mongoConnection')

const { getViews } = require('../mongodb/queries')

getViews()
	.then(views => {
		console.log(views)
		// mongoose.disconnect()
	})
	.catch(e => console.log(e))

// const syncHistory = async data => {
// 	await mdb.connect()
// 	const session = await mongoose.startSession()
// 	session.startTransaction({})
// 	try {
// 		const opts = { session }
// 		await ArticlesHistory.createCollection()
// 		await ArticlesHistory(data).save(opts)

// 		await session.commitTransaction()
// 		session.endSession()
// 		return 0
// 	} catch (error) {
// 		await session.abortTransaction()
// 		session.endSession()
// 		throw error
// 	}
// }

// syncHistory()
// mongoose.disconnect()
