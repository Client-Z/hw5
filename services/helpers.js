exports.findIndex = (blogs, id) => {
	for (let i = 0; i < blogs.length; i++) {
		if (blogs[i].id === id) return i
	}
	return null
}
