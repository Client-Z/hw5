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

const { users } = require('../models/data')
const { Users } = require('../db/models/index.js')
const helpers = require('../services/helpers')

router.get(
	'/',
	asyncHandler(async (req, res) => {
		const users = await Users.findAll()
		res.send({ data: users })
	})
)

router.post('/', (req, res) => {
	if (!req.body) return res.sendStatus(400)
	req.body.id = `i${(+new Date()).toString(16)}`
	users.unshift(req.body)
	res.json({ data: req.body })
})

router.get(
	'/:id',
	asyncHandler(async (req, res) => {
		if (!req.body) return res.sendStatus(400)
		const user = await Users.findOne({
			where: {
				id: req.params.id
			}
		})
		res.send({ data: user })
	})
)

router.put('/:id', (req, res) => {
	if (!req.body) return res.sendStatus(400)
	const idx = helpers.findIndex(users, req.params.id)
	if (idx === null) throw new Error(`The server has no any users with this id: ${req.params.id}`)
	if (req.body.email) users[idx].email = req.body.email
	if (req.body.firstName) users[idx].firstName = req.body.firstName
	if (req.body.lastName) users[idx].lastName = req.body.lastName
	res.send({ data: users[idx] })
})

router.delete('/:id', (req, res) => {
	if (!req.body) return res.sendStatus(400)
	const index = helpers.findIndex(users, req.params.id)
	if (index === null) throw new Error(`The server has no any users with this id: ${req.params.id}`)
	res.send({ data: users[index] })
	users.splice(index, 1)
})
module.exports = router
