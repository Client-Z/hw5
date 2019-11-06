const { avatarStorage, articlesStorage } = require('./gcStorageService')

class GCRemoverTool {
	constructor(storage, bucket) {
		this.gcStorage = storage
		this.gcsBucket = bucket
	}
	remove(data) {
		Array.isArray(data) ? this.removeMany(data) : this.removeOne(data)
	}

	removeMany(urls) {
		console.log(`in removeMany: ${urls}`)
		urls.forEach(url => this.removeOne(url))
	}

	removeOne(url) {
		const filePath = new URL(url).pathname
		const fileName = filePath.replace(new RegExp(`${this.gcsBucket.name}/`, 'g'), '')
		var gcFile = this.gcsBucket.file(fileName.slice(1))
		gcFile
			.delete()
			.then(() => console.log('img was removed'))
			.catch(e => console.log(e))
	}
}

const gcUserIMGRemover = new GCRemoverTool(avatarStorage.gcStorage, avatarStorage.gcsBucket)
const gcArticlesIMGRemover = new GCRemoverTool(articlesStorage.gcStorage, articlesStorage.gcsBucket)

module.exports = { gcUserIMGRemover, gcArticlesIMGRemover }
