const faker = require('faker')
const supertest = require('supertest')
const app = require('../../index')
// const SendGridService = require('')
const request = supertest(app)

module.exports = {
	registerUser: async () => {
		const firstName = faker.name.firstName()
		const lastName = faker.name.lastName()
		const email = faker.internet.email()
		const password = faker.internet.password()

		await request.post('/api/v1/registration').send({ firstName, lastName, email, password })
	}
}
