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
		await ArticlesViews.createCollection()
		// const viewsResult
		await ArticlesViews(data).save(opts)
		// const views = viewsResult._doc

		await session.commitTransaction()
		session.endSession()
		return mongoose
	} catch (error) {
		await session.abortTransaction()
		session.endSession()
		throw error
	}
}

const removeView = async articleId => {
	await mdb.connect()
	const session = await mongoose.startSession()
	session.startTransaction({})
	try {
		const opts = { session }
		await ArticlesViews.deleteOne({ articleId: articleId }, opts)

		await session.commitTransaction()
		session.endSession()
		return mongoose
	} catch (error) {
		await session.abortTransaction()
		session.endSession()
		throw error
	}
}

const getViews = async articleId => {
	await mdb.connect()
	const session = await mongoose.startSession()
	session.startTransaction({})
	try {
		const opts = { session }
		const viewsResult = await ArticlesViews.findOne({ articleId: articleId }, 'views', opts)
		const views = viewsResult._doc.views

		await session.commitTransaction()
		session.endSession()
		return { views, mongoose }
	} catch (error) {
		await session.abortTransaction()
		session.endSession()
		throw error
	}
}

module.exports = { insertView, removeView, getViews }
