/* eslint-disable */

class Storage {
	constructor() {
		this.bucket = jest.fn(() => {})
	}
	bucket() {
		jest.fn(() => {})
	}
}
module.exports = { Storage }
