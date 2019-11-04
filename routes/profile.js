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

// images
const { avatarMulter } = require('../services/multer')
// console.log(upload)
// const { sendUploadToGCS } = require('../services/middlewares/google-cloud-storage')

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
	})
)

module.exports = router

// if (!req.file) {
// 	res.status(400).send('No file uploaded.')
// 	return
// }
// // Create a new blob in the bucket and upload the file data.
// const blob = bucket.file(req.file.originalname)
// // Make sure to set the contentType metadata for the browser to be able
// // to render the image instead of downloading the file (default behavior)
// const blobStream = blob.createWriteStream({
// 	metadata: { contentType: req.file.mimetype }
// })
// blobStream.on('error', err => {
// 	next(err)
// 	return
// })
// blobStream.on('finish', () => {
// 	// The public URL can be used to directly access the file via HTTP.
// 	const url = `https://storage.googleapis.com/${bucket.name}/avatar/180x180/`
// 	// const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
// 	// Make the image public to the web (since we'll be displaying it in browser)
// 	blob.makePublic().then(() => {
// 		res.status(200).send(`Success!\n Image uploaded to ${url}`)
// 	})
// })
// blobStream.end(req.file.buffer)
