/*
	GET /api/v1/blog - get all blogs
	POST /api/v1/blog - add a new blog
	GET /api/v1/blog/:id - get the blog by id
	PUT /api/v1/blog/:id - update the blog by id
	DELETE /api/v1/blog/:id - delete the blog by id
	GET /blog/:articleId/comments - get all comments
	POST /blog/:articleId/comments - add a new comment
	DELETE /blog/:articleId/comments/:id - delete the comments
*/

const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const Op = require('sequelize').Op

const { Articles, Users, Comments } = require('../db/models/index.js')
const { insertView, removeView: removeArticlesView, getView, getViews } = require('../mongodb/queries')
const { combineArticles2Views } = require('../services/helpers')
const authCheck = require('../services/middlewares/authCheck')
const { articlesMulter } = require('../services/multer')
const { gcArticlesIMGRemover } = require('../services/gcRemovalService')
const { getArticles, getComments } = require('../services/queryHelperService')
const { articleValidation, commentValidation } = require('../services/validationService')

router.get(
	'/',
	asyncHandler(async (req, res) => {
		const articles = await getArticles(req.query.after)
		const views = await getViews()
		combineArticles2Views(articles, views)
		res.send({ data: articles })
	})
)

router.post(
	'/',
	[authCheck, articlesMulter.single('picture'), articleValidation],
	asyncHandler(async (req, res) => {
		let newArticle = null
		req.body.authorId = req.user.id
		if (req.file) req.body.picture = req.file.path
		newArticle = await Articles.create({ ...req.body })
		await insertView({ articleId: newArticle.id, authorId: newArticle.authorId, views: 0 })
		newArticle.view = 0
		res.send({ data: newArticle })
	})
)
router.put(
	'/:id',
	[authCheck, articlesMulter.single('picture'), articleValidation],
	asyncHandler(async (req, res) => {
		const data = await Articles.findByPk(req.params.id, { attributes: ['authorId', 'picture'] })
		const articleData = data.get({ plain: true })
		if (articleData.authorId === req.user.id) {
			let updatedArticle = null
			if (req.file) req.body.picture = req.file.path
			if (articleData.picture) await gcArticlesIMGRemover.remove(articleData.picture)
			updatedArticle = await Articles.update({ ...req.body }, { where: { id: req.params.id } })
			return updatedArticle > 0 ? res.status(200).send({}) : res.sendStatus(500)
		} else {
			res.sendStatus(403)
		}
	})
)

router.get(
	'/:id',
	asyncHandler(async (req, res) => {
		const article = await Articles.findByPk(req.params.id, {
			order: [['createdAt', 'DESC']],
			include: [{ model: Users, as: 'author' }]
		})
		const views = await getView(+req.params.id)
		article.dataValues.views = views
		res.send({ data: article })
	})
)

router.delete(
	'/:id',
	asyncHandler(async (req, res) => {
		const data = await Articles.findByPk(req.params.id, { attributes: ['authorId', 'picture'] })
		const articleData = data.get({ plain: true })
		if (articleData.authorId === req.user.id) {
			const destroyedArticle = await Articles.destroy({ where: { id: req.params.id } })
			await removeArticlesView(req.params.id)
			if (articleData.picture) await gcArticlesIMGRemover.remove(articleData.picture)
			destroyedArticle > 0 ? res.send({ data: articleData }) : res.sendStatus(500)
		} else {
			res.sendStatus(403)
		}
	})
)

// Comments
router.get(
	'/:id/comments',
	asyncHandler(async (req, res) => {
		let comments = null
		if (!req.query.after) {
			comments = await getComments({ articleId: req.params.id })
		} else {
			comments = await getComments({ [Op.and]: [{ id: { [Op.lt]: +req.query.after } }, { articleId: req.params.id }] })
		}
		res.send({ data: comments })
	})
)

router.post(
	'/:id/comments',
	authCheck,
	commentValidation,
	asyncHandler(async (req, res) => {
		req.body.authorId = req.user.id
		req.body.articleId = +req.params.id
		const newComment = await Comments.create({ ...req.body })
		const comment = newComment.get({ plain: true })
		comment.author = req.user
		// sockets
		const io = req.app.get('socketio')
		io.to(`room-${req.params.id}`).emit('comment', { action: 'create', data: { comment } })
		res.send({ data: comment })
	})
)

router.delete(
	'/:articleId/comments/:id',
	authCheck,
	asyncHandler(async (req, res) => {
		req.body.id = req.params.id
		const commentData = await Comments.findByPk(100)
		if (commentData) {
			const result = await commentData.destroy()
			const deletedComment = result.get({ plain: true })
			if (deletedComment) {
				// sockets
				const io = req.app.get('socketio')
				io.to(`room-${req.params.articleId}`).emit('comment', { action: 'destroy', data: { deletedComment } })
				return res.sendStatus(200)
			}
		}
		res.sendStatus(500)
	})
)

module.exports = router
