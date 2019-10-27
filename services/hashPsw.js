const bcrypt = require('bcrypt')
const saltRound = 10

const hashPassword = async user => {
	try {
		if (user.changed('password')) {
			user.password = await bcrypt.hash(user.password, saltRound)
		}
	} catch (err) {
		console.log(err)
	}
}

const checkPsw = async (psw, hash) => {
	try {
		return await bcrypt.compare(psw, hash)
	} catch (err) {
		console.log(err)
	}
}

module.exports = { hashPassword, checkPsw }
