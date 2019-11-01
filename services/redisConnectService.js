const R = require('ioredis')
const client = new R(process.env.REDIS_URL)
const { errorLogger } = require('./logger')

client.on('error', err => {
	errorLogger.error(`An error on Redis`, { metadata: err })
})

module.exports = client
