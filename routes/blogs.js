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

router.get('/', (req, res) => {
	res.status(200)
	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify({ data: blogs }))
})

router.post('/', (req, res) => {
	if (!req.body) return res.sendStatus(400)
	req.body.id = `i${(+new Date()).toString(16)}`
	blogs.push(req.body)
	res.status(200)
	res.setHeader('Content-Type', 'application/json')
	res.json(res.send(JSON.stringify({ data: req.body })))
})

router.get('/:id', (req, res) => {
	if (!req.body) return res.sendStatus(400)
	res.status(200)
	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify({ data: blogs.find(x => x.id === req.params.id) }))
})

router.put('/:id', (req, res) => {
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
	if (req.body.title) blogs[idx].title = req.body.title
	if (req.body.content) blogs[idx].content = req.body.content
	if (req.body.author) blogs[idx].author = req.body.author
	if (req.body.publishedAt) blogs[idx].publishedAt = req.body.publishedAt
	res.send(JSON.stringify({ data: blogs[idx] }))
})

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
	res.send(JSON.stringify({ data: blogs[idx] }))
	blogs.splice(idx, 1)
})
module.exports = router
