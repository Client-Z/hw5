const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20')

const { errorLogger } = require('./logger')
const { checkPsw } = require('./hashPsw')
const { Users, Providers } = require('../db/models/index.js')

const createOauthAccount = async (userID, profile) => {
	await Providers.create({ userId: userID, provider: profile.provider, providerUserId: profile.id })
}

module.exports = passport => {
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

	passport.use(
		new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
			try {
				const userData = await Users.unscoped().findOne({ where: { email: email } })
				const user = userData.get({ plain: true })
				const match = await checkPsw(password, user.password)
				if (match) return done(null, user)
				return done(null, {})
			} catch (err) {
				done(err)
				errorLogger.error(`An error on MySQL request`, { metadata: err })
			}
		})
	)

	passport.use(
		new GoogleStrategy(
			{
				callbackURL: process.env.LOCAL_GOOGLE_CALLBACK_URL,
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET
			},
			async (accessToken, refreshToken, profile, done) => {
				if (profile.id) {
					try {
						// Check if we already have a user with this email
						const userData = await Users.findOne({ where: { email: profile.emails[0].value } })
						if (userData) {
							const user = userData.dataValues
							const hasAccount = await Providers.findOne({ where: { providerUserId: profile.id } })
							if (!hasAccount) createOauthAccount(user.id, profile)
							done(null, user)
						} else {
							const newUser = await Users.create({
								firstName: profile.name.givenName,
								lastName: profile.name.familyName,
								email: profile.emails[0].value,
								password: ''
							})
							createOauthAccount(newUser.dataValues.id, profile)
							done(null, newUser.dataValues)
						}
					} catch (err) {
						errorLogger.error(`An error on MySQL request`, { metadata: err })
					}
				}
			}
		)
	)
}
