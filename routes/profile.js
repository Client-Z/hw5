/*
	PUT /api/v1/profile - update user
	DELETE /api/v1/profile - delete user
	PUT /api/v1/picture - update or add users picture
*/

const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

const { Users, Articles } = require('../db/models/index.js')
const authCheck = require('../services/middlewares/authCheck')
const { logOut } = require('../services/helpers')
const { avatarMulter } = require('../services/multer')
const { gcUserIMGRemover } = require('../services/gcRemovalService')

router.put(
	'/',
	authCheck,
	asyncHandler(async (req, res) => {
		req.user.update({ firstName: req.body.firstName, lastName: req.body.lastName })
		res.send({ data: req.user })
	})
)

router.delete(
	'/',
	authCheck,
	asyncHandler(async (req, res) => {
		const imgs = await Articles.findAll({ where: { authorId: req.user.id }, raw: true, attributes: ['picture'] })
		imgs.push({ picture: req.user.picture })
		await gcUserIMGRemover.remove(imgs)
		const destroyedUser = await Users.destroy({ where: { id: req.user.id } })
		if (destroyedUser > 0) return logOut(req, res)
		res.sendStatus(500)
	})
)

router.put(
	'/picture',
	authCheck,
	avatarMulter.single('picture'),
	asyncHandler(async (req, res) => {
		if (!req.file) return res.status(400).send('No file uploaded.')
		await req.user.update({ picture: req.file.path })
		res.send({ data: { picture: req.file.path } })
	})
)

module.exports = router
