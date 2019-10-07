const https = require('https')
const router = require('express').Router()

const blog = require('./blogs')
const user = require('./users')

router.use('/api/v1/users', user)
router.use('/api/v1/blog', blog)

router.get('*', (req, res) => {
	https.get(process.env.FRONTEND_URL, response => response.pipe(res))
})

module.exports = router
