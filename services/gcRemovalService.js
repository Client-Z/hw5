const { avatarStorage, articlesStorage } = require('./gcStorageService')
const { errorLogger } = require('./logger')

class GCRemoverTool {
	constructor(storage, bucket) {
		this.gcStorage = storage
		this.gcsBucket = bucket
	}
	remove(data) {
		Array.isArray(data) ? this.removeMany(data) : this.removeOne(data)
	}

	static removeMany(urls) {
		urls.forEach(url => {
			if (url.picture) this.removeOne(url.picture)
		})
	}

	static removeOne(url) {
		const filePath = new URL(url).pathname
		const fileName = filePath.replace(new RegExp(`${this.gcsBucket.name}/`, 'g'), '')
		var gcFile = this.gcsBucket.file(fileName.slice(1))
		gcFile.delete().catch(e => errorLogger.error(`Some problem with pictures removing`, { metadata: e }))
	}
}

const gcUserIMGRemover = new GCRemoverTool(avatarStorage.gcStorage, avatarStorage.gcsBucket)
const gcArticlesIMGRemover = new GCRemoverTool(articlesStorage.gcStorage, articlesStorage.gcsBucket)

module.exports = { gcUserIMGRemover, gcArticlesIMGRemover }
