/* istanbul ignore file */
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'Blog API',
		version: '1.0.0'
	},
	basePath: '/',
	components: {},
	security: []
}

const swaggerUiOptions = {
	customCss: '.swagger-ui .toolbar { display: none }',
	swaggerOptions: {
		filter: true
	}
}

module.exports = app => {
	app.use(
		'/docs',
		(req, res, next) => {
			try {
				req.swaggerDoc = swaggerJSDoc({
					swaggerDefinition,
					apis: [`${__dirname}/components/**/*.yaml`, `${__dirname}/paths/**/*.yaml`]
				})
			} catch (err) {
				console.log(err)
				return next(err)
			}
			next()
		},
		swaggerUi.serve,
		swaggerUi.setup(null, swaggerUiOptions)
	)
}
