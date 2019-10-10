require('dotenv').config()
const express = require('express')

// Database
const db = require('./db/dbConnection')
const app = express()

app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(express.json())

const routes = require('./routes')
app.use(routes)

app.use((req, res, next) => {
	const error = new Error('Not found')
	error.status = 404
	next(error)
})
app.use((error, req, res, next) => {
	res.status(error.status || 500)
	res.json({ data: error })
})

// Connect to DB and run the server
db.authenticate()
	.then(() => {
		console.log('DB connected...')
		app.listen(process.env.PORT, err => {
			if (err) console.error('something bad happened', err)
			console.log('server listening port 8803')
		})
	})
	.catch(err => console.log(`Error: ${err}`))
