const Op = require('sequelize').Op
const moment = require('moment')

const { Articles, Users, Comments } = require('../db/models/index')

const getArticles = async continuation => {
	const baseQuery = async where => {
		return await Articles.findAll({
			where: where,
			limit: 5,
			order: [['publishedAt', 'DESC']],
			include: [{ model: Users, as: 'author' }]
		})
	}
	if (continuation) {
		let beforeID = continuation.indexOf('_')
		const id = continuation.slice(++beforeID)
		const timestamp = continuation.slice(0, --beforeID)
		const publishedAt = moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
		return await baseQuery({ id: { [Op.lt]: +id }, publishedAt: { [Op.lt]: publishedAt } }) // e
	}
	return await baseQuery()
}

const getComments = async whereObj => {
	return await Comments.findAll({
		where: whereObj,
		limit: 5,
		order: [['createdAt', 'DESC']],
		include: [{ model: Users, as: 'author', attributes: ['id', 'firstName', 'lastName', 'picture'] }]
	})
}

module.exports = { getArticles, getComments }
