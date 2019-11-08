require('dotenv').config()
const http = require('http')
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
const client = require('./services/redisConnectService')

// app
const app = express()

app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(express.json())

// authentication
const rStore = new RSessionStore({ client, prefix: 'denis:sess:' })
app.use(
	session({
		store: rStore,
		secret: process.env.SESSION_SECRET,
		saveUninitialized: false,
		rolling: false,
		resave: false
	})
)
app.use(passport.initialize())
app.use(passport.session())

app.set('trust proxy', 1)
// apply Limiters
const { limiter, loginLimiter } = require('./services/rateLimitService')
app.use('/api/v1/blog', limiter)
app.use('/api/v1/users', limiter)
app.use('/api/v1/profile', limiter)
app.use('/api/v1/login', loginLimiter)

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

const server = http.createServer(app)

// WS
require('./services/socketService')(server, rStore)

// Connect to DB and run the server
db.authenticate()
	.then(() => {
		server.listen(process.env.PORT, err => {
			if (err) errorLogger.error(`Some problem with server running`, { metadata: err })
			console.log('server listening port 8803')
		})
	})
	.catch(err => errorLogger.error(`Some problem with MySQL connection`, { metadata: err }))
