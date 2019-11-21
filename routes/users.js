/*
	GET /api/v1/users - get all users
	POST /api/v1/users - add a new user
	GET /api/v1/users/:id - get the user by id
	PUT /api/v1/users/:id - update the user by id
	DELETE /api/v1/users/:id - delete the user by id
*/

const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

const { Users } = require('../db/models/index.js')
const db = require('../db/dbConnection')

const { getViews } = require('../mongodb/queries')
const { combineArticles2Views } = require('../services/helpers')
const authCheck = require('../services/middlewares/authCheck')
const { getArticles } = require('../services/queryHelperService')

router.get(
	'/',
	authCheck,
	asyncHandler(async (req, res) => {
		const users = await db.query(
			`
			SELECT
				users.id,
				users.email,
				users.first_name AS firstName,
				users.last_name AS lastName,
				users.last_name AS lastName,
				COUNT(articles.id) AS articlesCount
			FROM users 
			LEFT JOIN articles ON articles.author_id = users.id 
			GROUP BY users.id`,
			{ type: db.QueryTypes.SELECT }
		)
		const views = await getViews()
		users.forEach(item => {
			let viewsCount = 0
			views.forEach(view => {
				if (item.id === view.authorId) viewsCount += view.views
			})
			item.viewsCount = viewsCount
		})
		res.send({ data: users })
	})
)

router.get(
	'/:id',
	asyncHandler(async (req, res) => {
		const user = await Users.findByPk(req.params.id)
		res.send({ data: user })
	})
)

router.get(
	'/:id/blog',
	asyncHandler(async (req, res) => {
		const articles = await getArticles(req.query.after, req.params.id)
		const views = await getViews(req.params.id)
		combineArticles2Views(articles, views)
		res.send({ data: articles })
	})
)

module.exports = router
