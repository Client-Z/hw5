const https = require('https')
const router = require('express').Router()

const auth = require('./auth')
const oauth = require('./oauth')
const blog = require('./blogs')
const user = require('./users')

const { mongooseLogger } = require('../services/logger')

router.use('/api/v1/oauth', oauth)
router.use('/api/v1', auth)
router.use('/api/v1/users', user)
router.use('/api/v1/blog', blog)

router.get('*', (req, res) => {
	https.get(process.env.FRONTEND_URL, response => response.pipe(res))
	const date = new Date()
	mongooseLogger.info(`App: incoming ${req.method} request at ${date}`)
	console.log(req.isAuthenticated(), req.session)
})

module.exports = router
