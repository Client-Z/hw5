const https = require('https')
const mainRouter = require('express').Router()
const router = require('express').Router()

const blog = require('./blogs')
const user = require('./users')

mainRouter.get('*', (req, res) => {
	https.get(process.env.FRONTEND_URL, response => response.pipe(res))
})

router.use('/api/v1/users', user)
router.use('/api/v1/blog', blog)
router.use('/', mainRouter)

module.exports = router
