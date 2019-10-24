/*
	POST /api/v1/registration
	POST /api/v1/login
	POST /api/v1/logout
*/

const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

// const db = require('../db/dbConnection')

router.post(
	'/registration',
	asyncHandler(async (req, res) => {
		res.send({ data: {} })
	})
)

router.post(
	'/login',
	asyncHandler(async (req, res) => {
		res.send({ data: {} })
	})
)

router.post(
	'/logout',
	asyncHandler(async (req, res) => {
		res.send({ data: {} })
	})
)

module.exports = router
