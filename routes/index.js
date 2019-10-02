const { Router } = require('express')
const https = require('https')
const router = new Router()

router.get('*', (req, res) => {
	https.get(process.env.FRONTEND_URL, response => response.pipe(res))
})

module.exports = router
