const { Articles, Users } = require('../db/models/index')
const mongoose = require('../mongodb/mongoConnection')
const ArticlesViews = require('../mongodb/models/ArticlesViews')

module.exports = async () => {
	for (const model of [Articles, Users]) {
		await model.destroy({
			where: {},
			truncate: { cascade: true }
		})
	}
	await mongoose.connect()
	await ArticlesViews.deleteMany({}).exec()
}
