// route middleware to make sure a user is logged in
module.exports = (req, res, next) => {
	if (req.isAuthenticated()) return next()
	res.status(401).send('You have to be authenticated.')
}
