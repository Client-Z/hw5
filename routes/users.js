/*
	GET /api/v1/users - get all users
	POST /api/v1/users - add a new user
	GET /api/v1/users/:id - get the user by id
	PUT /api/v1/users/:id - update the user by id
	DELETE /api/v1/users/:id - delete the user by id
*/

const express = require('express')
const router = express.Router()

let users = [
	{
		id: '1',
		email: 'ddd@gmail.com',
		firstName: 'Li',
		lastName: 'Ju'
	}
]

// it works
router.get('/', (req, res) => {
	res.status(200)
	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify(users))
})

// it works
const jsonParser = express.json()
router.post('/', jsonParser, (req, res) => {
	if (!req.body) return res.sendStatus(400)
	req.body.id = `i${(+new Date()).toString(16)}`
	users.push(req.body)
	res.json(req.body)
})

// it works
router.get('/:id', (req, res) => {
	if (!req.body) return res.sendStatus(400)
	res.status(200)
	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify(users.find(x => x.id === req.params.id)))
})

// it works
router.delete('/:id', (req, res) => {
	if (!req.body) return res.sendStatus(400)
	res.status(200)
	res.setHeader('Content-Type', 'application/json')
	let idx = null
	for (let i = 0; i < users.length; i++) {
		if (users[i].id === req.params.id) {
			idx = i
			break
		}
	}
	res.send(JSON.stringify(users[idx]))
	users.splice(idx, 1)
})
module.exports = router
