/* eslint-disable */
const supertest = require('supertest')
const app = require('../../index')
const { sgMail } = require('../../services/emailService')
const helperService = require('../../services/helpers')
const { registerUser } = require('../helpers')

const request = supertest(app)

// try test
describe('it should test user logout', () => {
	let user

	beforeAll(async () => {
		user = await registerUser()
	})

	it('should log out user', async () => {
		const logOutSpy = jest.spyOn(helperService, 'logOut')
		await request
			.post('/api/v1/logout')
			.set('Cookie', user.authCookie)
			.send()
			.expect(200)
	})
})
