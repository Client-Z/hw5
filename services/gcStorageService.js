const { Storage } = require('@google-cloud/storage')
const path = require('path')
const sharp = require('sharp')
const { errorLogger } = require('./logger')

class GCStorage {
	constructor(opts) {
		if (!opts.bucket) throw new Error('You have to specify bucket for GCStorage.')
		if (!opts.keyFilename) throw new Error('You have to specify credentials key file for GCStorage.')
		this.getDestination = opts.destination || this.getDestination
		this.getFilename = opts.filename || this.getFilename
		this.gcStorage = new Storage({ keyFilename: opts.keyFilename })
		this.gcsBucket = this.gcStorage.bucket(opts.bucket)
		this.options = opts
	}

	getDestination(req, file, cb) {
		cb(null, `${this.options.prefix}/${this.options.size.width}x${this.options.size.height}/`)
	}

	getFilename(req, file, cb) {
		const prefix = Date.now()
		cb(null, `${prefix}-${file.originalname}`)
	}

	_handleFile(req, file, cb) {
		this.getDestination(req, file, (err, destination) => {
			if (err) return cb(err)
			this.getFilename(req, file, async (err, filename) => {
				if (err) return cb(err)
				const finalPath = path.join(destination, filename)
				let gcFile = this.gcsBucket.file(finalPath)
				const streamOpts = { predefinedAcl: this.options.acl || 'publicread' }
				const sharpResizer = sharp().resize(this.options.size.width, this.options.size.height)
				file.stream
					.pipe(sharpResizer)
					.pipe(gcFile.createWriteStream(streamOpts))
					.on('error', err => {
						errorLogger.error(`Error while file uploading`, { metadata: err })
						cb(err)
					})
					.on('finish', () => {
						cb(null, {
							path: `https://storage.googleapis.com/${this.options.bucket}/${finalPath}`,
							filename: filename
						})
					})
			})
		})
	}

	_removeFile(req, file, cb) {
		this.gcsBucket.file(file.filename).delete()
	}
}

const avatarStorage = new GCStorage({
	prefix: `denis/avatars`,
	bucket: process.env.BUCKET_NAME,
	keyFilename: path.join(__dirname, '../service-key.json'),
	size: { width: 180, height: 180 }
})

const articlesStorage = new GCStorage({
	prefix: `denis/articles`,
	bucket: process.env.BUCKET_NAME,
	keyFilename: path.join(__dirname, '../service-key.json'),
	size: { width: 1200, height: 630 }
})

module.exports = { avatarStorage, articlesStorage }
