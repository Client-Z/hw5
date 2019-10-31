const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20')
const FacebookStrategy = require('passport-facebook').Strategy

const { errorLogger } = require('./logger')
const { checkPsw } = require('./hashPsw')
const { Users, Providers } = require('../db/models/index.js')

const createOauthAccount = async (userID, provider, providerUserId) => {
	await Providers.create({ userId: userID, provider: provider, providerUserId: providerUserId })
}

const createUser = async (firstName, lastName, email) => {
	return await Users.create({ firstName: firstName, lastName: lastName, email: email, password: '' })
}

module.exports = passport => {
	passport.serializeUser((user, done) => done(null, user.id))

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await Users.findByPk(id)
			return done(null, user)
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
				callbackURL: process.env.GOOGLE_CALLBACK_URL,
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET
			},
			async (accessToken, refreshToken, profile, done) => {
				if (profile.id) {
					try {
						// Check if we already have a user with this email
						const email = profile.emails[0].value
						const userData = await Users.findOne({ where: { email: email } })
						if (userData) {
							const user = userData.dataValues
							const hasAccount = await Providers.findOne({ where: { providerUserId: profile.id } })
							if (!hasAccount) createOauthAccount(user.dataValues.id, profile.provider, profile.id)
							done(null, user)
						} else {
							const newUser = await createUser(profile.name.givenName, profile.name.familyName, email)
							createOauthAccount(newUser.dataValues.id, profile.provider, profile.id)
							done(null, newUser.dataValues)
						}
					} catch (err) {
						errorLogger.error(`An error on MySQL request`, { metadata: err })
					}
				}
			}
		)
	)

	passport.use(
		new FacebookStrategy(
			{
				clientID: process.env.FACEBOOK_CLIENT_ID,
				clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
				callbackURL: process.env.FACEBOOK_CALLBACK_URL,
				profileFields: ['id', 'displayName', 'email']
			},
			async (accessToken, refreshToken, profile, done) => {
				if (profile.id) {
					try {
						// Check if we already have a user with this email
						const userData = await Users.findOne({ where: { email: profile.emails[0].value } })
						if (userData) {
							const user = userData.dataValues
							const hasAccount = await Providers.findOne({ where: { providerUserId: profile.id } })
							if (!hasAccount) createOauthAccount(user.dataValues.id, profile.provider, profile.id)
							done(null, user)
						} else {
							let firstName = ''
							let lastName = ''
							let email = profile.emails[0].value
							if (!profile.name.givenName || !profile.name.familyName) {
								const splitPoint = profile.displayName.indexOf(' ')
								if (splitPoint) {
									firstName = profile.displayName.slice(0, splitPoint)
									lastName = profile.displayName.slice(splitPoint)
								} else {
									firstName = profile.displayName
									lastName = 'Is not indicated'
								}
							} else {
								firstName = profile.name.givenName
								lastName = profile.name.familyName
							}
							const newUser = await createUser(firstName, lastName, email)
							createOauthAccount(newUser.dataValues.id, profile.provider, profile.id)
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
