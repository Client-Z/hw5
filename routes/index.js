const https = require('https')
const router = require('express').Router()

const blog = require('./blogs')
const user = require('./users')

router.get('*', (req, res) => {
	https.get(process.env.FRONTEND_URL, response => response.pipe(res))
})
module.exports = app => {
	app.use('/api/v1/users', user)
	app.use('/api/v1/blog', blog)
	app.use('/', router)
}
