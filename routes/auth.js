/*
	POST /api/v1/registration
	POST /api/v1/login
	POST /api/v1/logout
*/

const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const { Users } = require('../db/models/index.js')
require('../services/passportService')(passport)
const { logOut, getFormattedUrl } = require('../services/helpers')
const { userCreationValidation, loginValidation } = require('../services/validationService')
const { sgMail } = require('../services/emailService')
const emailTemplates = require('../db/constant')

router.post(
	'/registration',
	userCreationValidation,
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
			const createdUser = newUser.get({ plain: true })
			jwt.sign(createdUser, 'secretkey', { expiresIn: '1h' }, (err, token) => {
				if (err) return res.sendStatus(403)
				const verifyLink = `${getFormattedUrl(req)}/verify?token=${token}`
				sgMail.send({
					to: createdUser.email,
					from: 'internship@zazmic.com',
					template_id: emailTemplates.accountVerificationTemplate,
					dynamic_template_data: {
						verifyLink: verifyLink,
						name: createdUser.firstName
					}
				})
				res.send({ data: newUser })
			})
		}
	})
)

router.post('/registration/verify', (req, res) => {
	jwt.verify(req.body.token, 'secretkey', (error, authData) => {
		if (error) return res.status(403).json({ errors: [{ msg: 'Try to register again' }] })
		req.logIn(authData, async err => {
			if (err) {
				res.status(500).send({ error: err })
			} else {
				const updatedData = await Users.update({ isVerified: true }, { where: { id: authData.id } })
				return updatedData > 0 ? res.send({ data: authData }) : res.sendStatus(500)
			}
		})
	})
})

router.post(
	'/login',
	loginValidation,
	passport.authenticate('local', {
		failureRedirect: '/login'
	}),
	(req, res) => res.send({ data: req.user })
)

router.post('/logout', (req, res) => logOut(req, res))

// JWT test
// FORMAT OF TOKEN
// Authorization: Bearer <access_token>
router.post('/jwt/protected-info', verifyToken, (req, res) => {
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		err ? res.sendStatus(403) : res.json({ message: 'Info have been got...', authData })
	})
})

router.post('/jwt/login', (req, res) => {
	const user = { id: 1, userName: 'David', email: 'david@gmail.com' }
	req.query = { ...user }
	jwt.sign({ userName: req.query.userName }, 'secretkey', { expiresIn: '60s' }, (err, token) => {
		err ? res.sendStatus(403) : res.json({ token })
	})
})

function verifyToken(req, res, next) {
	// Get auth header value
	const bearerHeader = req.headers['authorization']
	if (typeof bearerHeader !== 'undefined') {
		// Split at the space and get token from array
		const bearer = bearerHeader.split(' ')
		const bearerToken = bearer[1]
		req.token = bearerToken
		next()
	} else {
		// Forbidden
		res.sendStatus(403)
	}
}

module.exports = router
