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
const authCheck = require('../services/middlewares/authCheck')
const { logOut } = require('../services/helpers')

router.put(
	'/',
	authCheck,
	asyncHandler(async (req, res) => {
		const userItem = { firstName: req.body.firstName, lastName: req.body.lastName }
		const updatedUser = await Users.update(userItem, { where: { id: req.user.id } })
		if (updatedUser > 0) {
			const user = await Users.findByPk(req.user.id)
			res.send({ data: user })
		} else {
			res.sendStatus(500)
		}
	})
)

router.delete(
	'/',
	authCheck,
	asyncHandler(async (req, res) => {
		const destroyedUser = await Users.destroy({ where: { id: req.user.id } })
		if (destroyedUser > 0) return logOut(req, res)
		res.sendStatus(500)
	})
)
module.exports = router
