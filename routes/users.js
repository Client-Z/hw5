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
		let users = await db.query(
			`SELECT users.*, COUNT(articles.id) AS articles
			FROM users LEFT JOIN articles ON articles.author_id=users.id GROUP BY users.id`
		)
		let data = []
		for (let i = 0; i < users['0'].length; i++) {
			let obj = {}
			obj.id = users['0'][i].id
			obj.email = users['0'][i].email
			obj.password = users['0'][i].password
			obj.articles = users['0'][i].articles
			obj.firstName = users['0'][i].first_name
			obj.lastName = users['0'][i].last_name
			obj.createdAt = users['0'][i].created_at
			obj.updatedAt = users['0'][i].updated_at
			data.push(obj)
		}
		res.send({ data: data })
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
			}
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
