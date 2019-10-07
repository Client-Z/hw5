/*
	GET /api/v1/blog - get all blogs
	POST /api/v1/blog - add a new blog
	GET /api/v1/blog/:id - get the blog by id
	PUT /api/v1/blog/:id - update the blog by id
	DELETE /api/v1/blog/:id - delete the blog by id
*/

const express = require('express')
const router = express.Router()
const { blogs } = require('../models/data')
const helpers = require('../services/helpers')

router.get('/', (req, res, next) => res.send({ data: blogs }))

router.post('/', (req, res, next) => {
	if (!req.body) return res.sendStatus(400)
	req.body.id = `i${(+new Date()).toString(16)}`
	blogs.unshift(req.body)
	res.send({ data: req.body })
})

router.get('/:id', (req, res, next) => {
	if (!req.body) return res.sendStatus(400)
	res.send({ data: blogs.find(x => x.id === req.params.id) })
})

router.put('/:id', (req, res, next) => {
	if (!req.body) return res.sendStatus(400)
	const idx = helpers.findIndex(blogs, req.params.id)
	if (idx === null) throw new Error(`The server has no any articles with this id: ${req.params.id}`)
	if (req.body.title) blogs[idx].title = req.body.title
	if (req.body.content) blogs[idx].content = req.body.content
	if (req.body.author) blogs[idx].author = req.body.author
	if (req.body.publishedAt) blogs[idx].publishedAt = req.body.publishedAt
	res.send({ data: blogs[idx] })
})

router.delete('/:id', (req, res, next) => {
	if (!req.body) return res.sendStatus(400)
	const index = helpers.findIndex(blogs, req.params.id)
	if (index === null) throw new Error(`The server has no any articles with this id: ${req.params.id}`)
	res.send({ data: blogs[index] })
	blogs.splice(index, 1)
})
module.exports = router
