// google cloud storage engine
const { Storage } = require('@google-cloud/storage')
const path = require('path')
const fs = require('fs')

const bucketName = 'zazmic-internship-blog' // 'GCS_BUCKET', 'z-stream-internship'

class GCStorage extends Storage {
	constructor(opts) {
		super(opts)
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
		const prefix = new Date().toISOString()
		cb(null, `${prefix}-${file.originalname}`)
	}

	_handleFile(req, file, cb) {
		this.getDestination(req, file, (err, destination) => {
			if (err) return cb(err)
			this.getFilename(req, file, async (err, filename) => {
				if (err) return cb(err)
				const finalPath = path.join(destination, filename)
				var gcFile = this.gcsBucket.file(finalPath)
				const streamOpts = { predefinedAcl: this.options.acl || 'publicread' }
				file.stream
					.pipe(gcFile.createWriteStream(streamOpts))
					.on('error', err => {
						cb(err)
						console.log(`stream error: ${err}`)
					})
					.on('finish', async file => {
						cb(null, {
							path: `https://${this.options.bucket}.storage.googleapis.com/${finalPath}`,
							filename: filename
						})
					})
			})
		})
	}

	_removeFile(req, file, cb) {
		const path = file.path
		delete file.destination
		delete file.filename
		delete file.path
		fs.unlink(path, cb)
	}
}

const avatarStorage = new GCStorage({
	prefix: `denis/avatars`,
	bucket: bucketName, // process.env.GCS_BUCKET,
	keyFilename: path.join(__dirname, '../gcs-key.json'), // process.env.GOOGLE_APPLICATION_CREDENTIALS,
	size: { width: 180, height: 180 }
})

const articlesStorage = new GCStorage({
	prefix: `denis/articles`,
	bucket: bucketName, // process.env.GCS_BUCKET,
	keyFilename: path.join(__dirname, '../gcs-key.json'), // process.env.GOOGLE_APPLICATION_CREDENTIALS,
	size: { width: 1200, height: 630 }
})

module.exports = { avatarStorage, articlesStorage }
