const { validationResult } = require('express-validator')

const validation = rules => {
	const middlewares = [
		...rules,
		(req, res, next) => {
			const errors = validationResult(req)
			if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() })
			next()
		}
	]
	return middlewares
}

module.exports = { validation }
