const socketio = require('socket.io')
const passportSocketIo = require('passport.socketio')
const adapter = require('socket.io-redis')

module.exports = function(server, rStore) {
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
	})
}
