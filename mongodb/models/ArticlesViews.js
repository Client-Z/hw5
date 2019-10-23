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

articlesViews.pre('updateOne', function(next) {
	this.set({ updatedAt: new Date() })
	next()
})

articlesViews.pre('save', function(next) {
	this.set({ createdAt: new Date() })
	next()
})

// logging changes in mongoDB
articlesViews.post('find', function(docs) {
	const ids = docs.map(doc => doc.articleId)
	mongooseLogger.info(`The articles were requested with ids: ${ids}`)
})

articlesViews.post('findOneAndUpdate', async function(doc) {
	mongooseLogger.info(`An article was updated with id: ${doc.articleId}`)
})
articlesViews.post('findOneAndDelete', async function(doc) {
	mongooseLogger.info(`An article was deleted with id: ${doc.articleId}`)
})

articlesViews.post('save', function(doc) {
	mongooseLogger.info(`An article was created with id: ${doc.articleId}`)
})

module.exports = mongoose.model('articles_view', articlesViews)
