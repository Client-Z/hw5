const socketio = require('socket.io')
const passportSocketIo = require('passport.socketio')
const adapter = require('socket.io-redis')

const { errorLogger } = require('./logger')

module.exports = (server, rStore, wsLimiter) => {
	const io = socketio(server)
	io.adapter(adapter(process.env.REDIS_URL))
	io.use(
		passportSocketIo.authorize({
			secret: process.env.SESSION_SECRET,
			store: rStore,
			fail: (data, message, error, accept) => accept()
		})
	)

	io.on('connection', function(socket) {
		io.of('/').adapter.clients((err, clients) => {
			if (err) errorLogger.error(`Some problem with socket connection`, { metadata: err })
		})
		const ip = socket.request.connection.remoteAddress
		socket.use((packet, next) => {
			wsLimiter
				.consume(ip)
				.then(consume => next())
				.catch(consume => next(new Error('Rate limit error')))
		})
		if (socket.request.user.logged_in) {
			socket.on('watch-comments', articleId => {
				socket.join(`room-${articleId}`)
				socket.on('comment-typing', articleId => {
					socket.to(`room-${articleId}`).emit('comment-typing', { action: 'typing' })
				})
			})
			socket.on('unwatch-comments', articleId => socket.leave(`room-${articleId}`))
		}
	})
	return io
}
