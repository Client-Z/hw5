var LocalStrategy = require('passport-local').Strategy
const { errorLogger } = require('./logger')

var Users = require('../db/models/Users')
const { checkPsw } = require('./hashPsw')

module.exports = (passport, asyncHandler) => {
	passport.use(
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password'
			},
			asyncHandler(async (email, password, done) => {
				try {
					const userData = await Users.unscoped().findOne({
						where: { email: email }
					})
					const user = userData.dataValues
					const match = await checkPsw(password, user.password)
					if (match) return done(null, user)
					return done(null, {})
				} catch (err) {
					done(err)
					errorLogger.error(`An error on MySQL request`, { metadata: err })
				}
			})
		)
	)

	passport.serializeUser((user, done) => done(null, user.id))

	passport.deserializeUser(async (id, done) => {
		try {
			const userData = await Users.findAll({ where: { id: id } })
			const user = userData[0].dataValues
			if (user) return done(null, user)
			done(null, false)
		} catch (err) {
			done(err)
			errorLogger.error(`An error on MySQL request`, { metadata: err })
		}
	})
}
