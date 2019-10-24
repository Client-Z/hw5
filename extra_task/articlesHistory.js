const mongoose = require('mongoose')
const { ArticlesLogs, ArtHistory } = require('./HistoryModels')
const { getViews } = require('../mongodb/queries')
const { mongooseLogger } = require('./../services/logger')

// Getting all articles logs
const getArticlesLogs = async () => {
	const session = await mongoose.startSession()
	session.startTransaction({})
	try {
		const articlesLogs = await ArticlesLogs.find({}).session(session)
		await session.commitTransaction()
		session.endSession()
		return articlesLogs
	} catch (error) {
		await session.abortTransaction()
		session.endSession()
		throw error
	}
}

// delete collection and create a new one with new history
const insertHistory = async data => {
	const session = await mongoose.startSession()
	session.startTransaction({})
	try {
		await ArtHistory.deleteMany({}).session(session)
		await ArtHistory.insertMany(data, { session })

		await session.commitTransaction()
		session.endSession()
		return mongoose
	} catch (error) {
		await session.abortTransaction()
		session.endSession()
		throw error
	}
}

/*
	here we pick up all items which were looked by users and group them
	then we filter out all previous views except the latest one and push it into our history
*/
;(async () => {
	let views = await getViews()
	let logs = await getArticlesLogs()
	// get all logs where is the time of the view article by any user and group them by articleId
	let viewTimeStamps = {}
	views.forEach(view => {
		for (let key in logs) {
			if (view.articleId === logs[key].meta.articleId) {
				if (!viewTimeStamps[view.articleId]) {
					let obj = { articleId: view.articleId, authorId: view.authorId, viewedAt: [] }
					obj.viewedAt.push(logs[key].timestamp)
					viewTimeStamps[view.articleId] = obj
				} else {
					viewTimeStamps[view.articleId].viewedAt.push(logs[key].timestamp)
				}
			}
		}
	})
	// find data about the latest view of the each article
	let articlesHistory = []
	for (let key in viewTimeStamps) articlesHistory.push(viewTimeStamps[key])
	insertHistory(articlesHistory)
		.then(() => process.exit(0))
		.catch(e => {
			mongooseLogger.error('Something went wrong', { meta: { error: e } })
			process.exit(1)
		})
})()
