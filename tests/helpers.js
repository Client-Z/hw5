/* eslint-disable */
const faker = require('faker')
const supertest = require('supertest')
const app = require('../index')
const { SendgridService } = require('../services/emailService')
const request = supertest(app)

module.exports = {
	registerUser: async () => {
		const firstName = faker.name.firstName()
		const lastName = faker.name.lastName()
		const email = faker.internet.email()
		const password = faker.internet.password()
		const sendEmailSpy = jest.spyOn(SendgridService, 'sendEmail').mockImplementation()

		await request.post('/api/v1/registration').send({ firstName, lastName, email, password })
		const { verifyLink } = sendEmailSpy.mock.calls[0][3]
		const token = verifyLink.split('token=').pop()
		const response = await request.post('/api/v1/registration/verify').send({ token })

		sendEmailSpy.mockReset()
		const user = response.body.data
		user.authCookie = response.headers['set-cookie'][0].split(';').shift()

		return user
	}
}
