const express = require('express')

const app = express()

app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(express.json())

app.use((req, res, next) => {
	const error = new Error('Not found')
	error.status = 404
	next(error)
})

app.use((error, req, res, next) => {
	res.status(error.status || 500)
	res.json({
		error: {
			message: error.message
		}
	})
})

// eslint-disable-next-line no-unused-vars
const routes = require('./routes')(app)

app.listen(process.env.PORT, err => {
	if (err) console.error('something bad happened', err)
	console.log('server listening port 8803')
})
