const mongoose = require('mongoose')
const { Schema } = mongoose

// articlesLogs schema
const artViews = new Schema({
	_id: Schema.Types.ObjectId,
	timestamp: Date,
	level: String,
	message: String,
	meta: {
		articleId: Number
	}
})
const ArticlesLogs = mongoose.model('articles_logs', artViews)

// articlesHistory schema
const artHistory = new Schema({
	articleId: Number,
	authorId: Number,
	viewedAt: Array
})
const ArtHistory = mongoose.model('articles_history', artHistory)

module.exports = { ArticlesLogs, ArtHistory }
