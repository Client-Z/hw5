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

const { Users, Articles } = require('../db/models/index.js')
const db = require('../db/dbConnection')

router.get(
	'/',
	asyncHandler(async (req, res) => {
		const users = await db.query(
			`
			SELECT
				users.id,
				users.email,
				users.first_name AS firstName,
				users.last_name AS lastName,
				users.last_name AS lastName,
				COUNT(articles.id) AS articles
			FROM users 
			LEFT JOIN articles ON articles.author_id = users.id 
			GROUP BY users.id`,
			{ type: db.QueryTypes.SELECT }
		)
		res.send({ data: users })
	})
)

router.post(
	'/',
	asyncHandler(async (req, res) => {
		if (!req.body) return res.sendStatus(400)
		const newUser = await Users.create({
			...req.body,
			createdAt: new Date(),
			updatedAt: new Date()
		})
		res.send({ data: newUser })
	})
)

router.get(
	'/:id',
	asyncHandler(async (req, res) => {
		if (!req.body) return res.sendStatus(400)
		const user = await Users.findByPk(req.params.id)
		res.send({ data: user })
	})
)

router.get(
	'/:id/blog',
	asyncHandler(async (req, res) => {
		if (!req.body) return res.sendStatus(400)
		const articles = await Articles.findAll({
			where: {
				authorId: req.params.id
			},
			order: [['createdAt', 'DESC']],
			include: [{ model: Users, as: 'author' }] // need to add 'author'
		})
		res.send({ data: articles })
	})
)

router.put(
	'/:id',
	asyncHandler(async (req, res) => {
		if (!req.body) return res.sendStatus(400)
		const updatedUser = await Users.update(
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
		res.send({ data: updatedUser })
	})
)

router.delete(
	'/:id',
	asyncHandler(async (req, res) => {
		if (!req.body) return res.sendStatus(400)
		const destroyedUser = await Users.destroy({
			where: {
				id: req.params.id
			}
		})
		res.send({ data: destroyedUser })
	})
)
module.exports = router
