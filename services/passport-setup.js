const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')

passport.use(
	new GoogleStrategy(
		{
			// opts for google strategy
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET
		},
		() => {
			// passport cb func
		}
	)
)
