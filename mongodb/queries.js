const ArticlesViews = require('./models/ArticlesViews')
const { articlesLogger, errorLogger, mongooseLogger } = require('./../services/logger')

ArticlesViews.createCollection()
	.then(() => mongooseLogger.info(`The collection is ready to use.`))
	.catch(e => errorLogger.error(`An error on CreateCollection method`, { metadata: e }))

const insertView = async data => {
	try {
		await ArticlesViews(data).save()
		mongooseLogger.info(`Added a new article`, { metadata: { articleId: data.articleId } })
	} catch (error) {
		errorLogger.error(`An error on MongoDB's transaction`, { metadata: error })
		throw error
	}
}

const removeView = async articleId => {
	try {
		await ArticlesViews.findOneAndDelete({ articleId: articleId })
		mongooseLogger.info(`Removed an article`, { metadata: { articleId: articleId } })
	} catch (error) {
		errorLogger.error(`An error on MongoDB's transaction`, { metadata: error })
		throw error
	}
}

const getView = async articleId => {
	try {
		const viewsResult = await ArticlesViews.findOneAndUpdate({ articleId: articleId }, { $inc: { views: 1 } })
		const views = viewsResult._doc.views + 1
		mongooseLogger.info(`Updated an article`, { metadata: { articleId: articleId } })
		articlesLogger.info(`Viewed an article`, { metadata: { articleId: articleId } })
		return views
	} catch (error) {
		errorLogger.error(`An error on MongoDB's transaction`, { metadata: error })
		throw error
	}
}

const getViews = async () => {
	try {
		return await ArticlesViews.find()
	} catch (error) {
		errorLogger.error(`An error on MongoDB's transaction`, { metadata: error })
		throw error
	}
}

module.exports = { insertView, removeView, getView, getViews }
