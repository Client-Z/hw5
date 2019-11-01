const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20')
const FacebookStrategy = require('passport-facebook').Strategy

const { errorLogger } = require('./logger')
const { checkPsw } = require('./hashPsw')
const { Users } = require('../db/models/index.js')
const { AuthService } = require('./AuthService')

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
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: process.env.GOOGLE_CALLBACK_URL
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const user = await AuthService.findOrCreateOauthProvider({
						provider: 'google',
						email: profile._json.email,
						firstName: profile._json.given_name,
						lastName: profile._json.family_name,
						providerUserId: profile.id
					})
					done(null, user)
				} catch (e) {
					done(e)
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
				profileFields: ['id', 'email', 'first_name', 'last_name']
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					// let firstName = ''
					// let lastName = ''
					// if (!profile.name.givenName || !profile.name.familyName) {
					// 	const splitPoint = profile.displayName.indexOf(' ')
					// 	if (splitPoint) {
					// 		firstName = profile.displayName.slice(0, splitPoint)
					// 		lastName = profile.displayName.slice(splitPoint)
					// 	} else {
					// 		firstName = profile.displayName
					// 		lastName = 'Is not indicated'
					// 	}
					// } else {
					// 	firstName = profile.name.givenName
					// 	lastName = profile.name.familyName
					// }
					const user = await AuthService.findOrCreateOauthProvider({
						provider: 'facebook',
						email: profile._json.email,
						firstName: profile.name.givenName,
						lastName: profile.name.familyName,
						providerUserId: profile.id
					})
					done(null, user)
				} catch (error) {
					done(error)
				}
			}
		)
	)

	// 	passport.use(
	// 		new FacebookStrategy(
	// 			{
	// 				clientID: process.env.FACEBOOK_CLIENT_ID,
	// 				clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
	// 				callbackURL: process.env.FACEBOOK_CALLBACK_URL,
	// 				profileFields: ['id', 'displayName', 'email']
	// 			},
	// 			async (accessToken, refreshToken, profile, done) => {
	// 				if (profile.id) {
	// 					try {
	// 						const email = profile.emails[0].value
	// 						const user = await checkUser(email, profile.provider, profile.id)
	// 						if (user) return done(null, user)
	// 						let firstName = ''
	// 						let lastName = ''
	// 						if (!profile.name.givenName || !profile.name.familyName) {
	// 							const splitPoint = profile.displayName.indexOf(' ')
	// 							if (splitPoint) {
	// 								firstName = profile.displayName.slice(0, splitPoint)
	// 								lastName = profile.displayName.slice(splitPoint)
	// 							} else {
	// 								firstName = profile.displayName
	// 								lastName = 'Is not indicated'
	// 							}
	// 						} else {
	// 							firstName = profile.name.givenName
	// 							lastName = profile.name.familyName
	// 						}
	// 						const newUser = await createUser(firstName, lastName, email)
	// 						createOauthAccount(newUser.dataValues.id, profile.provider, profile.id)
	// 						done(null, newUser)
	// 					} catch (err) {
	// 						errorLogger.error(`An error on MySQL request`, { metadata: err })
	// 					}
	// 				}
	// 			}
	// 		)
	// 	)
}
