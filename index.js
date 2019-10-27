require('dotenv').config()
const express = require('express')
const session = require('express-session')
const passport = require('passport')

// Databases
const db = require('./db/dbConnection')
require('./mongodb/mongoConnection')

const connectRedis = require('connect-redis')
const RSessionStore = connectRedis(session)
const client = require('./services/redis')

const app = express()

app.use(
	session({
		store: new RSessionStore({
			client,
			prefix: 'denis:sess:'
		}),
		secret: '%secret@Str#',
		saveUninitialized: false, // false
		resave: false // false
	})
)
app.use(passport.initialize())
app.use(passport.session())

// app.use(flash())
// require('./services/passport')(passport)
// const passportSetup = require('./services/passport-setup')

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
