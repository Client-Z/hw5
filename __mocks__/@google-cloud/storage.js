/* eslint-disable */

class Storage {
	constructor(bucket = 'bucket') {
		this.bucket = jest.fn(() => {})
	}
	bucket() {
		jest.fn(() => {})
	}
}
module.exports = { Storage }
