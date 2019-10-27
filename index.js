require('dotenv').config()
const express = require('express')
const session = require('express-session')
const passport = require('passport')

// logger
const { errorLogger } = require('./services/logger')

// Databases
const db = require('./db/dbConnection')
require('./mongodb/mongoConnection')

const connectRedis = require('connect-redis')
const RSessionStore = connectRedis(session)
const client = require('./services/redis')

// app
const app = express()

app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(express.json())

// authentication
app.use(
	session({
		store: new RSessionStore({
			client,
			prefix: 'denis:sess:'
		}),
		secret: '%secret@Str#',
		saveUninitialized: false,
		resave: false
	})
)
app.use(passport.initialize())
app.use(passport.session())

// routes
const routes = require('./routes')
app.use(routes)

// error handlers
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
		app.listen(process.env.PORT, err => {
			if (err) errorLogger.error(`Some problem with server running`, { metadata: err })
			console.log('server listening port 8803')
		})
	})
	.catch(err => errorLogger.error(`Some problem with MySQL connection`, { metadata: err }))
