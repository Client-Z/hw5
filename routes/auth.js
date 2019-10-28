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
const { errorLogger } = require('../services/logger')
require('../services/passport-local-setup')(passport)

router.post(
	'/registration',
	asyncHandler(async (req, res) => {
		try {
			const userData = await Users.findAll({ where: { email: req.body.email } })
			if (userData.length) {
				res.status(500)
				res.send('{ error: "User with this email already exist" }').end()
			} else {
				const newUser = await Users.create({
					...req.body,
					createdAt: new Date(),
					updatedAt: new Date()
				})
				req.logIn(newUser.dataValues, function(err) {
					if (err) return res.status(500).send({ error: err })
					res.send({ data: newUser })
				})
			}
		} catch (err) {
			res.send({ error: err })
			errorLogger.error(`An error on MySQL request`, { metadata: err })
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

router.post('/logout', (req, res) => {
	req.logout()
	req.session.destroy()
	res.send({})
})

module.exports = router
