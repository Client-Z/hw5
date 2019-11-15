const Op = require('sequelize').Op
const moment = require('moment')
const { Articles, Users, Comments } = require('../db/models/index')

const getArticles = async continuation => {
	const baseQuery = async where => {
		return await Articles.findAll({
			where: where,
			limit: 5,
			order: [['publishedAt', 'DESC'], ['id', 'ASC']],
			include: [{ model: Users, as: 'author' }]
		})
	}
	if (continuation) {
		const [timestamp, id] = continuation.split('_')
		const publishedAt = moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
		return await baseQuery({ id: { [Op.lte]: +id }, publishedAt: { [Op.lt]: publishedAt } }) // timestamp
	}
	return await baseQuery()
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
