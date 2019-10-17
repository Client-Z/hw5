const mongoose = require('mongoose')
const { Schema } = mongoose

// const mgsLogger = require('../logger/logger').mgsLogger

const articlesViews = new Schema({
	articleId: Number,
	authorId: Number,
	views: Number
})

// articlesViews.post('save', (doc) => {
// 	mgsLogger.info(`Some description`)
// })

module.exports = mongoose.model('articles_view', articlesViews)
