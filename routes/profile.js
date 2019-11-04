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
const { avatarMulter } = require('../services/multer')

router.put(
	'/',
	authCheck,
	asyncHandler(async (req, res, next) => {
		req.user.update({ firstName: req.body.firstName, lastName: req.body.lastName })
		res.send({ data: req.user })
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

router.put(
	'/picture',
	avatarMulter.single('picture'),
	asyncHandler(async (req, res, next) => {
		console.log('HERE', req.file)
		if (!req.file) return res.status(400).send('No file uploaded.')
	})
)

module.exports = router
