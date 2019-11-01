/*
	GET /api/v1/oauth/google
	POST /api/v1/oauth/google/callback
	GET /api/v1/oauth/facebook
	POST /api/v1/oauth/facebook/callback
*/
const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }))

// needs the right callback url
router.post('/google/callback', passport.authenticate('google'), (req, res) => {
	res.send({ data: req.user })
})

// needs the right callback url
router.post('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
	res.send({ data: req.user })
})

module.exports = router
