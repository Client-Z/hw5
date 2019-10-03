/*
	GET /api/v1/blog - get all blogs
	POST /api/v1/blog - add a new blog
	GET /api/v1/blog/:id - get the blog by id
	PUT /api/v1/blog/:id - update the blog by id
	DELETE /api/v1/blog/:id - delete the blog by id
*/

const express = require('express')
const router = express.Router()

let blogs = [
	{
		id: '1',
		title: 'Some title',
		content: 'Some text',
		author: 'John Doe',
		publishedAt: 'Wednesday'
	}
]

// it works
router.get('/', (req, res) => {
	console.log('here')
	res.status(200)
	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify(blogs))
})

// it works
const jsonParser = express.json()
router.post('/', jsonParser, (req, res) => {
	if (!req.body) return res.sendStatus(400)
	req.body.id = `i${(+new Date()).toString(16)}`
	blogs.push(req.body)
	res.json(req.body)
})

// it works
router.get('/:id', (req, res) => {
	if (!req.body) return res.sendStatus(400)
	res.status(200)
	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify(blogs.find(x => x.id === req.params.id)))
})

// it works
router.delete('/:id', (req, res) => {
	if (!req.body) return res.sendStatus(400)
	res.status(200)
	res.setHeader('Content-Type', 'application/json')
	let idx = null
	for (let i = 0; i < blogs.length; i++) {
		if (blogs[i].id === req.params.id) {
			idx = i
			break
		}
	}
	res.send(JSON.stringify(blogs[idx]))
	blogs.splice(idx, 1)
})
module.exports = router
