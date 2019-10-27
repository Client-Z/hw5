const R = require('ioredis')
const client = new R(process.env.REDIS_URL)

client.on('error', err => {
	console.log(err)
})

module.exports = client
