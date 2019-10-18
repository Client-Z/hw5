const mongoose = require('mongoose')
const { Schema } = mongoose

const { mongooseLogger } = require('../../services/logger')

const articlesViews = new Schema({
	articleId: Number,
	authorId: Number,
	views: Number,
	updatedAt: Date,
	createdAt: Date
})

articlesViews.pre('updateOne', function() {
	this.update({}, { $set: { updatedAt: new Date() } })
})

articlesViews.pre('save', function() {
	this.set({ createdAt: new Date() })
})

// logging changes in mongoDB
articlesViews.post('find', function() {
	mongooseLogger.info(`Mongo: Something were requested`)
})

articlesViews.post('findOne', function() {
	mongooseLogger.info(`Mongo: Some doc was requested`)
})

articlesViews.post('updateOne', function() {
	mongooseLogger.info(`Mongo: Something was updated`)
})

articlesViews.post('deleteOne', function() {
	mongooseLogger.info(`Mongo: Some doc was deleted`)
})

articlesViews.post('save', function() {
	mongooseLogger.info(`Mongo: Something was created`)
})

module.exports = mongoose.model('articles_view', articlesViews)
