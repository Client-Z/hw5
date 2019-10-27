var LocalStrategy = require('passport-local').Strategy

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
					const userData = await Users.findAll({
						where: {
							email: email
						}
					})
					const user = userData[0].dataValues
					const match = await checkPsw(password, userData[0].dataValues.password)
					if (match) return done(null, user)
					return done(null, {})
				} catch (err) {
					done(err)
				}
			})
		)
	)

	passport.serializeUser((user, done) => done(null, user.id))

	passport.deserializeUser(async (id, done) => {
		try {
			const userData = await Users.findAll({
				where: {
					id: id
				}
			})
			const user = userData[0].dataValues
			if (user) return done(null, user)
			done(null, false)
		} catch (e) {
			done(e)
		}
	})
}
