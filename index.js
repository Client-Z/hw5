const express = require('express')
const routes = require('./routes')

const app = express()

app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(express.json())
app.use(routes)

app.listen(process.env.PORT, err => {
	if (err) console.error('something bad happened', err)
	console.log('server listening port 8803')
})
