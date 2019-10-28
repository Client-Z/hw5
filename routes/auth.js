/*
	POST /api/v1/registration
	POST /api/v1/login
	POST /api/v1/logout
*/

const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const passport = require('passport')

const { Users } = require('../db/models/index.js')
require('../services/passport-local-setup')(passport)
const { logOut } = require('../services/helpers')

router.post(
	'/registration',
	asyncHandler(async (req, res) => {
		const userData = await Users.findOne({ where: { email: req.body.email } })
		if (userData) {
			res.status(500)
			res.send('{ error: "User with this email already exist" }').end()
		} else {
			const userItem = {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				password: req.body.password
			}
			const newUser = await Users.create(userItem)
			req.logIn(newUser.dataValues, function(err) {
				if (err) return res.status(500).send({ error: err })
				res.send({ data: newUser })
			})
		}
	})
)

router.post(
	'/login',
	passport.authenticate('local', {
		failureRedirect: '/login'
	}),
	(req, res) => res.send({ data: req.user })
)

router.post('/logout', (req, res) => logOut(req, res))

module.exports = router
