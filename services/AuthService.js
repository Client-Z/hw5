const { errorLogger } = require('./logger')
const { Users, Providers } = require('../db/models/index.js')

class AuthService {
	static async findOrCreateOauthProvider({ provider, email, firstName, lastName, providerUserId }) {
		try {
			const userData = await Users.findOne({ where: { email } })
			if (userData) {
				const user = userData.get({ plain: true })
				const hasAccount = await Providers.findOne({ where: { providerUserId } })
				if (!hasAccount) await this.createOauthAccount(user.id, provider, providerUserId)
				return user
			} else {
				const newUser = await this.createUser(firstName, lastName, email)
				await this.createOauthAccount(newUser.dataValues.id, provider, providerUserId)
				return newUser.get({ plain: true })
			}
		} catch (err) {
			errorLogger.error(`An error on MySQL request`, { metadata: err })
		}
	}

	static async createOauthAccount(userId, provider, providerUserId) {
		await Providers.create({ userId, provider, providerUserId })
	}

	static async createUser(firstName, lastName, email) {
		return await Users.create({ firstName, lastName, email, password: '' })
	}
}

module.exports = { AuthService }
