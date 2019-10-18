/*
	GET /api/v1/blog - get all blogs
	POST /api/v1/blog - add a new blog
	GET /api/v1/blog/:id - get the blog by id
	PUT /api/v1/blog/:id - update the blog by id
	DELETE /api/v1/blog/:id - delete the blog by id
*/

const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

const { Articles, Users } = require('../db/models/index.js')
const { insertView, removeView: removeArticlesView, getView, getViews } = require('../mongodb/queries')
const { combineArticles2Views } = require('../services/helpers')
const { articlesLogger } = require('../services/logger')

router.get(
	'/',
	asyncHandler(async (req, res) => {
		const articles = await Articles.findAll({
			order: [['createdAt', 'DESC']],
			include: [{ model: Users, as: 'author' }]
		})
		const { views, mongoose } = await getViews()
		mongoose.disconnect()
		combineArticles2Views(articles, views)
		res.send({ data: articles })
	})
)

router.post(
	'/',
	asyncHandler(async (req, res) => {
		const newArticle = await Articles.create({
			...req.body
		})
		const mongoose = await insertView({ articleId: newArticle.id, authorId: newArticle.authorId, views: 0 })
		mongoose.disconnect()
		newArticle.view = 0
		res.send({ data: newArticle })
	})
)

router.get(
	'/:id',
	asyncHandler(async (req, res) => {
		const article = await Articles.findByPk(req.params.id, {
			order: [['createdAt', 'DESC']],
			include: [{ model: Users, as: 'author' }]
		})
		const { views, mongoose } = await getView(req.params.id)
		mongoose.disconnect()
		article.dataValues.views = views + 1
		res.send({ data: article })
		const date = new Date()
		articlesLogger.info(`Viewed at ${date}`)
	})
)

router.put(
	'/:id',
	asyncHandler(async (req, res) => {
		const updatedArticle = await Articles.update(
			{ ...req.body },
			{
				where: {
					id: req.params.id
				}
			}
		)
		updatedArticle > 0 ? res.send({}) : res.sendStatus(500)
	})
)

router.delete(
	'/:id',
	asyncHandler(async (req, res) => {
		const destroyedArticle = await Articles.destroy({
			where: {
				id: req.params.id
			}
		})
		const mongoose = await removeArticlesView(req.params.id)
		mongoose.disconnect()
		destroyedArticle > 0 ? res.send({}) : res.sendStatus(500)
	})
)
module.exports = router
