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

router.get(
	'/',
	asyncHandler(async (req, res) => {
		const articles = await Articles.findAll({
			order: [['createdAt', 'DESC']],
			include: [{ model: Users, as: 'author' }]
		})
		res.send({ data: articles })
	})
)

router.post(
	'/',
	asyncHandler(async (req, res) => {
		if (!req.body) return res.sendStatus(400)
		const newArticle = await Articles.create({
			...req.body,
			createdAt: new Date(),
			updatedAt: new Date()
		})
		res.send({ data: newArticle })
	})
)

router.get(
	'/:id',
	asyncHandler(async (req, res) => {
		if (!req.body) return res.sendStatus(400)
		const article = await Articles.findByPk(req.params.id)
		res.send({ data: article })
	})
)

router.put(
	'/:id',
	asyncHandler(async (req, res) => {
		if (!req.body) return res.sendStatus(400)
		const updatedArticle = await Articles.update(
			{
				...req.body,
				updatedAt: new Date()
			},
			{
				where: {
					id: req.params.id
				}
			}
		)
		res.send({ data: updatedArticle })
	})
)

router.delete(
	'/:id',
	asyncHandler(async (req, res) => {
		if (!req.body) return res.sendStatus(400)
		const destroyedArticle = await Articles.destroy({
			where: {
				id: req.params.id
			}
		})
		res.send({ data: destroyedArticle })
	})
)
module.exports = router
