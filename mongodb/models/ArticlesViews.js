const mongoose = require('mongoose')
const { Schema } = mongoose

// const mgsLogger = require('../logger/logger').mgsLogger

const articlesViews = new Schema({
	articleId: Number,
	authorId: Number,
	views: Number,
	updatedAt: Date,
	createdAt: Date
})

articlesViews.pre('updateOne', () => this.update({}, { $set: { updatedAt: new Date() } }))
articlesViews.pre('save', () => this.set({ createdAt: new Date() }))

module.exports = mongoose.model('articles_view', articlesViews)
