const url = require('url')

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

const getFormattedUrl = req => url.format({ protocol: req.protocol, host: req.get('host') })

module.exports = { combineArticles2Views, logOut, getFormattedUrl }
