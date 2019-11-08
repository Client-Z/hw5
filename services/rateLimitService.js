const RateLimit = require('express-rate-limit')
const RLimitStore = require('rate-limit-redis')
const { RateLimiterRedis } = require('rate-limiter-flexible')

module.exports = client => {
	const limiter = new RateLimit({
		store: new RLimitStore({
			client: client,
			prefix: 'denis:limits:'
		}),
		max: 200,
		delayMs: 0
	})

	const loginLimiter = new RateLimit({
		store: new RLimitStore({
			client: client,
			prefix: 'denis:loginLimits:'
		}),
		windowMs: 10 * 60 * 1000,
		max: 20,
		delayMs: 0
	})

	const wsLimiter = new RateLimiterRedis({
		redis: client,
		keyPrefix: 'denis:socket:rl:',
		points: 3,
		duration: 30
	})

	return { limiter, loginLimiter, wsLimiter }
}
