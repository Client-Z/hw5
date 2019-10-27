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

router.put(
	'/',
	authCheck,
	asyncHandler(async (req, res) => {
		const userID = req.session.passport.user
		const updatedUser = await Users.update(
			{
				...req.body,
				updatedAt: new Date()
			},
			{
				where: {
					id: userID
				}
			}
		)
		if (updatedUser > 0) {
			const user = await Users.findByPk(userID)
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
		const destroyedUser = await Users.destroy({
			where: {
				id: req.session.passport.user
			}
		})
		if (destroyedUser > 0) {
			req.logout()
			req.session.destroy()
			res.send({})
		} else {
			res.sendStatus(500)
		}
	})
)
module.exports = router
