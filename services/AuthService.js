const { errorLogger } = require('./logger')
const { Users, Providers } = require('../db/models/index.js')

class AuthService {
	static async findOrCreateOauthProvider(data) {
		try {
			const userData = await Users.findOne({ where: { email: data.email } })
			if (userData) {
				const user = userData.get({ plain: true })
				const hasAccount = await Providers.findOne({ where: { providerUserId: data.providerUserId } })
				if (!hasAccount) await this.createOauthAccount(user.id, data.provider, data.providerUserId)
				return user
			} else {
				const newUser = await this.createUser(data.firstName, data.lastName, data.email)
				await this.createOauthAccount(newUser.dataValues.id, data.provider, data.providerUserId)
				return newUser.get({ plain: true })
			}
		} catch (err) {
			errorLogger.error(`An error on MySQL request`, { metadata: err })
		}
	}

	static async createOauthAccount(userID, provider, providerUserId) {
		await Providers.create({ userId: userID, provider: provider, providerUserId: providerUserId })
	}

	static async createUser(firstName, lastName, email) {
		return await Users.create({ firstName: firstName, lastName: lastName, email: email, password: '' })
	}
}

module.exports = { AuthService }
