const { body } = require('express-validator')

const { validation } = require('../services/middlewares/validation')

const isPass = value => {
	const letters = /[a-zA-Z]/
	const numbers = /[0-9]/
	if (value.length < 6) return false
	if (!letters.test(value)) return false
	if (!numbers.test(value)) return false
	return true
}

const checkCommentLength = value => value.length > 2

const userCreationValidation = validation([
	body('firstName')
		.exists({ checkFalsy: true })
		.withMessage('First name is required'),
	body('lastName')
		.exists({ checkFalsy: true })
		.withMessage('Last name is required'),
	body('email')
		.exists({ checkFalsy: true })
		.withMessage('Email is required')
		.isEmail()
		.withMessage('Should be an email'),
	body('password')
		.exists({ checkFalsy: true })
		.withMessage('Password is required')
		.custom(isPass)
		.withMessage('Password must have at least 6 symbols and digits.')
])

const loginValidation = validation([
	body('email')
		.exists({ checkFalsy: true })
		.withMessage('Email is required')
		.isEmail()
		.withMessage('Should be an email'),
	body('password')
		.exists({ checkFalsy: true })
		.withMessage('Password is required')
		.custom(isPass)
		.withMessage('Password must have at least 6 symbols and digits.')
])

const isValidDate = value => {
	const date = new Date(value)
	if (date.getDate) return true
	return false
}

const articleValidation = validation([
	body('title')
		.exists({ checkFalsy: true })
		.withMessage('Title is required'),
	body('content')
		.exists({ checkFalsy: true })
		.withMessage('Content is required'),
	body('publishedAt')
		.exists({ checkFalsy: true })
		.withMessage('publishedAt is required')
		.custom(isValidDate)
		.withMessage('publishedAt must be valid')
])

const editUserValidation = validation([
	body('firstName')
		.exists({ checkFalsy: true })
		.withMessage('First name is required'),
	body('lastName')
		.exists({ checkFalsy: true })
		.withMessage('Last name is required')
])

const commentValidation = validation([
	body('content')
		.exists({ checkFalsy: true })
		.withMessage('Content is required')
		.custom(checkCommentLength)
		.withMessage('Content must have at least 2 symbols')
])

module.exports = { userCreationValidation, articleValidation, loginValidation, editUserValidation, commentValidation }
