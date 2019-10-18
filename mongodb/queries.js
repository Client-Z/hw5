const mongoose = require('mongoose')
const { MDatabase: mdb } = require('./mongoConnection')

const ArticlesViews = require('./models/ArticlesViews')

const { articlesLogger, errorLogger } = require('./../services/logger')

const insertView = async data => {
	await mdb.connect()
	const session = await mongoose.startSession()
	session.startTransaction({})
	try {
		const opts = { session }
		await ArticlesViews.createCollection()
		await ArticlesViews(data).save(opts)
		articlesLogger.info(`Added a new article`, { metadata: { articleId: data.articleId } })

		await session.commitTransaction()
		session.endSession()
		return mongoose
	} catch (error) {
		errorLogger.error(`An error on MongoDB's transaction`, { metadata: error })
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
		articlesLogger.info(`Removed an article`, { metadata: { articleId: articleId } })

		await session.commitTransaction()
		session.endSession()
		return mongoose
	} catch (error) {
		errorLogger.error(`An error on MongoDB's transaction`, { metadata: error })
		await session.abortTransaction()
		session.endSession()
		throw error
	}
}

const getView = async articleId => {
	await mdb.connect()
	const session = await mongoose.startSession()
	session.startTransaction({})
	try {
		const opts = { session }
		const viewsResult = await ArticlesViews.findOne({ articleId: articleId }, 'views', opts)
		const views = viewsResult._doc.views
		await ArticlesViews.updateOne({ articleId: articleId }, { $set: { views: views + 1 } }, opts)
		const date = new Date()
		articlesLogger.info(`Viewed an article`, { metadata: { articleId: articleId, viewedAt: date } })
		articlesLogger.info(`Updated an article`, { metadata: { articleId: articleId } })

		await session.commitTransaction()
		session.endSession()
		return { views, mongoose }
	} catch (error) {
		errorLogger.error(`An error on MongoDB's transaction`, { metadata: error })
		await session.abortTransaction()
		session.endSession()
		throw error
	}
}

const getViews = async () => {
	await mdb.connect()
	const session = await mongoose.startSession()
	session.startTransaction({})
	try {
		const opts = { session }
		const views = await ArticlesViews.find({}, null, opts)

		await session.commitTransaction()
		session.endSession()
		return { views, mongoose }
	} catch (error) {
		errorLogger.error(`An error on MongoDB's transaction`, { metadata: error })
		await session.abortTransaction()
		session.endSession()
		throw error
	}
}

module.exports = { insertView, removeView, getView, getViews }
