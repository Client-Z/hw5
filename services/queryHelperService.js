const Op = require('sequelize').Op
const { Articles, Users, Comments } = require('../db/models/index')

const getArticles = async (after, authorId) => {
	let whereObj = {}
	if (after) {
		const [timestamp, id] = after.split('_')
		whereObj = { id: { [Op.gt]: +id }, publishedAt: { [Op.lte]: timestamp } }
	}
	if (authorId) whereObj.authorId = authorId
	return await Articles.findAll({
		where: whereObj,
		limit: 5,
		order: [
			['publishedAt', 'DESC'],
			['id', 'ASC']
		],
		include: [{ model: Users, as: 'author' }]
	})
}

const getComments = async (articleId, continuation) => {
	let whereObj = !continuation ? { articleId } : { id: { [Op.lt]: continuation }, articleId }
	return await Comments.findAll({
		where: whereObj,
		limit: 5,
		order: [['id', 'DESC']],
		include: [{ model: Users, as: 'author', attributes: ['id', 'firstName', 'lastName', 'picture'] }]
	})
}

module.exports = { getArticles, getComments }
