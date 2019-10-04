const express = require('express')
// eslint-disable-next-line no-unused-vars
const env = require('dotenv').config()

const app = express()

app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(express.json())

// eslint-disable-next-line no-unused-vars
const routes = require('./routes')(app)

app.use((req, res, next) => {
	const error = new Error('Not found')
	error.status = 404
	next(error)
})
app.use((error, req, res, next) => {
	res.status(error.status || 500)
	res.json({ data: error })
})

app.listen(process.env.PORT, err => {
	if (err) console.error('something bad happened', err)
	console.log('server listening port 8803')
})
