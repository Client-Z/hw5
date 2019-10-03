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

router.get('/', (req, res) => {
	res.status(200)
	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify({ data: users }))
})

router.post('/', (req, res) => {
	if (!req.body) return res.sendStatus(400)
	req.body.id = `i${(+new Date()).toString(16)}`
	users.push(req.body)
	res.json({ data: req.body })
})

router.get('/:id', (req, res) => {
	if (!req.body) return res.sendStatus(400)
	res.status(200)
	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify({ data: users.find(x => x.id === req.params.id) }))
})

router.put('/:id', (req, res) => {
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
	if (req.body.email) users[idx].email = req.body.email
	if (req.body.firstName) users[idx].firstName = req.body.firstName
	if (req.body.lastName) users[idx].lastName = req.body.lastName
	res.send(JSON.stringify({ data: users[idx] }))
})

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
	res.send(JSON.stringify({ data: users[idx] }))
	users.splice(idx, 1)
})
module.exports = router
