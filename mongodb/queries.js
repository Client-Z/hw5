const mongoose = require('mongoose')
const ArticlesViews = require('./models/ArticlesViews')
const { articlesLogger, errorLogger } = require('./../services/logger')

ArticlesViews.createCollection()
	.then(() => articlesLogger.info(`The collection is ready to use.`))
	.catch(e => errorLogger.error(`An error on CreateCollection method`, { metadata: e }))

const insertView = async data => {
	const session = await mongoose.startSession()
	session.startTransaction({})
	try {
		const opts = { session }
		await ArticlesViews(data).save(opts)
		articlesLogger.info(`Added a new article`, { metadata: { articleId: data.articleId } })

		await session.commitTransaction()
		session.endSession()
	} catch (error) {
		errorLogger.error(`An error on MongoDB's transaction`, { metadata: error })
		await session.abortTransaction()
		session.endSession()
		throw error
	}
}

const removeView = async articleId => {
	const session = await mongoose.startSession()
	session.startTransaction({})
	try {
		const opts = { session }
		await ArticlesViews.findOneAndDelete({ articleId: articleId }, opts)
		articlesLogger.info(`Removed an article`, { metadata: { articleId: articleId } })

		await session.commitTransaction()
		session.endSession()
	} catch (error) {
		errorLogger.error(`An error on MongoDB's transaction`, { metadata: error })
		await session.abortTransaction()
		session.endSession()
		throw error
	}
}

const getView = async articleId => {
	const session = await mongoose.startSession()
	session.startTransaction({})
	try {
		const opts = { session }
		const viewsResult = await ArticlesViews.findOneAndUpdate({ articleId: articleId }, { $inc: { views: 1 } }, opts)
		const views = viewsResult._doc.views + 1

		const date = new Date()
		articlesLogger.info(`Viewed an article`, { metadata: { articleId: articleId, viewedAt: date } })
		articlesLogger.info(`Updated an article`, { metadata: { articleId: articleId } })

		await session.commitTransaction()
		session.endSession()
		return views
	} catch (error) {
		errorLogger.error(`An error on MongoDB's transaction`, { metadata: error })
		await session.abortTransaction()
		session.endSession()
		throw error
	}
}

const getViews = async () => {
	const session = await mongoose.startSession()
	session.startTransaction({})
	try {
		const opts = { session }
		const views = await ArticlesViews.find({}, null, opts)

		await session.commitTransaction()
		session.endSession()
		return views
	} catch (error) {
		errorLogger.error(`An error on MongoDB's transaction`, { metadata: error })
		await session.abortTransaction()
		session.endSession()
		throw error
	}
}

module.exports = { insertView, removeView, getView, getViews }
