const { Strategy } = require('passport')
const faker = require('faker')

class MockStrategy extends Strategy {
	constructor(options, verify) {
		super()
		this.user = {
			id: faker.random.number(),
			_json: {
				given_name: faker.name.firstName(),
				family_name: faker.name.lastName(),
				email: faker.internet.email()
			}
		}
		this.name = 'google'
		this.options = options
		this.verify = verify
	}

	authenticate(req) {
		if (req.query.code) return this.redirect('/')
		this.verify(null, null, this.user, (err, user) => {
			if (err) return this.fail(err)
			return this.success(user)
		})
	}
}

module.exports = MockStrategy
