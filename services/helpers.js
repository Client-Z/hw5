const combineArticles2Views = (articles, views) => {
	articles.forEach(item => {
		views.forEach(view => {
			if (item.dataValues.id === view.articleId) item.dataValues.views = view.views
		})
	})
}

const logOut = (req, res) => {
	req.logout()
	req.session.destroy()
	res.send({})
}

module.exports = { combineArticles2Views, logOut }
