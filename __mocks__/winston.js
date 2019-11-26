/* eslint-disable */
const winston = {
	format: {
		combine: jest.fn(),
		splat: jest.fn(),
		simple: jest.fn()
	},
	transports: jest.fn(),
	createLogger: jest.fn(() => {
		return {
			info: jest.fn(),
			error: jest.fn(),
			end: jest.fn()
		}
	})
}

winston.transports.Console = jest.fn()
winston.transports.MongoDB = jest.fn()

module.exports = winston
