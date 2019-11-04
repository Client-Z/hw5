const Multer = require('multer')

const { avatarStorage, articlesStorage } = require('./gcStorageService')

const avatarMulter = Multer({
	storage: avatarStorage,
	limits: {
		fileSize: 5 * 1024 * 1024 // Max file size is 5MB
	}
})

const articlesMulter = Multer({
	storage: articlesStorage,
	limits: {
		fileSize: 5 * 1024 * 1024
	}
})

module.exports = { avatarMulter, articlesMulter }
