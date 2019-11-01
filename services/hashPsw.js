const bcrypt = require('bcrypt')
const { errorLogger } = require('./logger')
const saltRound = 10

const hashPassword = async user => {
	try {
		if (user.changed('password')) {
			user.password = await bcrypt.hash(user.password, saltRound)
		}
	} catch (err) {
		errorLogger.error(`Some problem with passwords hashing`, { metadata: err })
	}
}

const checkPsw = (psw, hash) => bcrypt.compare(psw, hash)

module.exports = { hashPassword, checkPsw }
