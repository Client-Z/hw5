const socketio = require('socket.io')
const passportSocketIo = require('passport.socketio')
const adapter = require('socket.io-redis')

module.exports = (server, rStore, wsLimiter) => {
	const io = socketio(server)
	io.adapter(adapter(process.env.REDIS_URL))
	io.use(
		passportSocketIo.authorize({
			// key: sessionConfig.name,
			secret: process.env.SESSION_SECRET,
			store: rStore,
			fail: (data, message, error, accept) => {
				accept()
			}
		})
	)

	io.on('connection', function(socket) {
		console.log(`Socket ${socket.id} connected.`)
		io.of('/').adapter.clients((err, clients) => {
			if (err) console.log(`sockets error: ${err}`)
			console.log(`${clients.length} client(s) connected.`)
		})
		const ip = socket.request.connection.remoteAddress
		if (socket.request.user.logged_in) {
			console.log(socket.request.user.get({ plain: true }), socket.request.user.logged_in)
			socket.use((packet, next) => {
				const event = packet[0]
				console.log({ event })
				wsLimiter
					.consume(ip)
					.then(consume => {
						console.log({ consume })
						next()
					})
					.catch(consume => next(new Error('Rate limit error')))
			})

			socket.on('watch-comments', articleId => {
				console.log('Joining to room id', articleId)
				// check permission ?
				socket.join(`room-${articleId}`, () => {
					const rooms = Object.keys(socket.rooms)
					const message = `${socket.request.user.firstName} has joined to room ${articleId}`
					console.log(message, rooms)
					io.to(`room-${articleId}`).emit('comment', { action: 'create', data: message })
				})
			})
		}

		// socket.on('leave', (roomId) => {
		// 	console.log('Leaving room id', roomId);
		// 	socket.leave(`room-${roomId}`, () => {
		// 		const rooms = Object.keys(socket.rooms);
		// 		const message = `${userName} has left room ${roomId}`;
		// 		console.log(message);
		// 		console.log(rooms);
		// 		io.to(`room-${roomId}`).emit('message', { roomId, message })
		// 	});
		// });

		// socket.on('message', (roomId, message) => {
		// 	console.log('Message', roomId, message);
		// 	io.to(`room-${roomId}`).emit('message', { roomId, message: `${userName} ${message}` });
		// });

		// socket.on('disconnect', (reason) => {
		// 	console.log(`Socket ${socket.id} disconnected. Reason:`, reason);
		// 	console.log(socket.request.user)
		// })
	})
}
