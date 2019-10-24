const mongoose = require('mongoose')
const { ArticlesLogs, ArtHistory } = require('./HistoryModels')
const { getViews } = require('../mongodb/queries')

// Getting all articles logs
const getArticlesLogs = async () => {
	try {
		return await ArticlesLogs.find({})
	} catch (error) {
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
					viewTimeStamps[view.articleId] = { articleId: view.articleId, authorId: view.authorId, viewedAt: [] }
					viewTimeStamps[view.articleId].viewedAt.push(logs[key].timestamp)
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
		.catch(() => process.exit(1))
})()
