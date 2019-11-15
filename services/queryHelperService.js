const Op = require('sequelize').Op
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
		// console.log(id, typeof timestamp)
		// let beforeID = continuation.indexOf('_')
		// const id = continuation.slice(++beforeID)
		// const timestamp = continuation.slice(0, --beforeID)
		// const publishedAt = moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
		console.log('timestamp: ', id)
		return await baseQuery({ id: { [Op.lt]: +id }, publishedAt: { [Op.lte]: timestamp } }) // e
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
