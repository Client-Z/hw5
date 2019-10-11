const bcrypt = require('bcrypt')

const hashPassword = async user => {
	try {
		if (user.changed('password')) {
			const salt = await bcrypt.genSalt(10)
			user.password = await bcrypt.hash(user.password, salt)
		}
	} catch (error) {
		console.log(error)
	}
}

module.exports = hashPassword
