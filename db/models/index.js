const models = {
	Users: require('./Users'),
	Articles: require('./Articles')
}

const modelNames = Object.keys(models)

modelNames.forEach(modelName => {
	if (models[modelName].associate) {
		models[modelName].associate(models)
	}
})

module.exports = models
