const https = require('https')
const router = require('express').Router()

const blog = require('./blogs')
const user = require('./users')

const { mongooseLogger } = require('../services/logger')

router.use('/api/v1/users', user)
router.use('/api/v1/blog', blog)

router.get('*', (req, res) => {
	https.get(process.env.FRONTEND_URL, response => response.pipe(res))
	const date = new Date()
	mongooseLogger.info(`App: incoming ${req.method} request at ${date}`)
})

module.exports = router
