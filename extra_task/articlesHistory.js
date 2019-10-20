const mongoose = require('mongoose')
const { Schema } = mongoose
const { MDatabase: mdb } = require('../mongodb/mongoConnection')
require('dotenv').config()
const { getViews } = require('../mongodb/queries')

// articlesLogs schema
const artViews = new Schema({
	_id: Schema.Types.ObjectId,
	timestamp: Date,
	level: String,
	message: String,
	meta: {
		articleId: String,
		viewedAt: Date
	}
})
const ArticlesLogs = mongoose.model('articles_logs', artViews)

// articlesHistory schema
const artHistory = new Schema({
	articleId: Number,
	authorId: Number,
	viewedAt: Date
})
const ArtHistory = mongoose.model('articles_history', artHistory)

// Getting all articles logs
const getArticlesLogs = async () => {
	await mdb.connect()
	const session = await mongoose.startSession()
	session.startTransaction({})
	try {
		const opts = { session }
		const articlesLogs = await ArticlesLogs.find({}, null, opts)

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
	await mdb.connect()
	const session = await mongoose.startSession()
	session.startTransaction({})
	try {
		await ArtHistory.deleteMany({}, function(err) {
			if (err) {
				console.log('collection was not removed', err)
			} else {
				console.log('collection removed')
			}
		})
		await ArtHistory.createCollection()
		await ArtHistory.insertMany(data)

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
const createHistoryCollection = (views, logs) => {
	// get all logs where is the time of the view article by any user and group them by articleId
	let viewTimeStamps = {}
	views.forEach(view => {
		for (let key in logs) {
			if (view.articleId === +logs[key].meta.articleId && logs[key].meta.viewedAt) {
				if (!viewTimeStamps[view.articleId]) viewTimeStamps[view.articleId] = []
				let obj = { articleId: view.articleId, authorId: view.authorId, viewedAt: logs[key].meta.viewedAt }
				viewTimeStamps[view.articleId].push(obj)
			}
		}
	})
	// find data about the latest view of the each article
	let articlesHistory = []
	for (let key in viewTimeStamps) {
		let lvItem = viewTimeStamps[key][0]
		for (let i = 1; i < viewTimeStamps[key].length; i++) {
			lvItem = viewTimeStamps[key][i].viewedAt > lvItem.viewedAt ? viewTimeStamps[key][i] : lvItem
		}
		articlesHistory.push(lvItem)
	}
	insertHistory(articlesHistory)
		.then(() => {
			console.log('done')
			mongoose.disconnect()
		})
		.catch(e => {
			console.log(e)
			mongoose.disconnect()
		})
}

const syncHistory = async () => {
	let views = await getViews()
	let articlesLogs = await getArticlesLogs()
	mongoose.disconnect()
	createHistoryCollection(views.views, articlesLogs)
}
syncHistory()
