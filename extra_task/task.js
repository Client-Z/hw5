const http = require('http')
class App {
	constructor() {
		this.nextStack = []
	}

	use(fn) {
		if (typeof fn === 'function') {
			this.nextStack.push(fn)
		} else {
			throw new Error('Not a function was passed to the "use" method!')
		}
	}

	handle(req, res) {
		this.nextStack = this.nextStack.map((fn, index) => {
			return () => fn(req, res, () => this.nextStack[index + 1](req, res))
		})
		this.nextStack[0]()
	}
}

const app = new App()
const server = http.createServer((req, res) => app.handle(req, res))

app.use((req, res, next) => {
	console.log('middleware 1 start')
	req.test = 'hello from middleware 1'
	next()
	console.log('middleware 1 end')
})

app.use((req, res, next) => {
	console.log('middleware 2')
	console.log(req.test)
	next()
})

app.use((req, res, next) => {
	console.log('middleware 3')
	res.end('Hello')
})

server.listen(3000, () => {
	console.log('listening...')
})

// Output in the console should be
// middleware 1 start
// middleware 2
// hello from middleware 1
// middleware 3
// middleware 1 end
