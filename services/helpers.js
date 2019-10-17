const combineArticles2Views = (articles, views) => {
	articles.forEach(item => {
		views.forEach(view => {
			if (item.dataValues.id === view.articleId) item.dataValues.views = view.views
		})
	})
}

module.exports = { combineArticles2Views }
