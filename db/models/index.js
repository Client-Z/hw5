const models = {
	Users: require('./Users'),
	Articles: require('./Articles'),
	Providers: require('./Providers'),
	Comments: require('./Comments')
}

const modelNames = Object.keys(models)

modelNames.forEach(modelName => {
	if (models[modelName].associate) {
		models[modelName].associate(models)
	}
})

module.exports = models
