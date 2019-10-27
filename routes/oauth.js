/*
	GET /api/v1/oauth/google
	POST /api/v1/oauth/google/callback
	GET /api/v1/oauth/facebook
	POST /api/v1/oauth/facebook/callback
*/
const express = require('express')
const router = express.Router()
// const asyncHandler = require('express-async-handler')
const passport = require('passport')
// const { Users } = require('../db/models/index.js')
// const redis = require('../services/redis')

router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile']
	})
)

// needs the right callback url
router.get('/google/callback', (req, res) => {
	res.send('you reached the callback URI')
})

module.exports = router
