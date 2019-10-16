const mongoose = require('mongoose')
const mdb = require('./mongoConnection')

const ArticlesViews = require('./models/ArticlesViews')

const insertView = async data => {
	console.log(data)
	await mdb.connect()
	const session = await mongoose.startSession()
	session.startTransaction({})
	try {
		const opts = { session }
		console.log('here')
		await ArticlesViews.createCollection()

		const viewsResult = await ArticlesViews(data).save(opts)
		const views = viewsResult._doc

		await session.commitTransaction()
		session.endSession()
		return views
	} catch (error) {
		await session.abortTransaction()
		session.endSession()
		throw error
	}
}

module.exports = insertView
