const Op = require('sequelize').Op
const { Articles, Users } = require('../db/models/index')

const getArticles = async continuation => {
	if (!continuation) {
		return await Articles.findAll({
			limit: 5,
			order: [['createdAt', 'DESC']],
			include: [{ model: Users, as: 'author' }]
		})
	} else {
		let beforeID = continuation.indexOf('_')
		const id = continuation.slice(++beforeID)
		return await Articles.findAll({
			where: { id: { [Op.lt]: +id } },
			limit: 5,
			order: [['createdAt', 'DESC']],
			include: [{ model: Users, as: 'author' }]
		})
	}
}

module.exports = { getArticles }
