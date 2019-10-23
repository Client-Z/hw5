const winston = require('winston')
require('winston-mongodb')
const connectionStr = require('../mongodb/mongoConnection')

const { format, transports, createLogger } = winston

const mongooseLogger = createLogger({
	format: format.combine(format.splat(), format.simple()),
	transports: [
		new transports.MongoDB({
			db: connectionStr,
			collection: 'mongoose_logs',
			decolorize: true,
			options: {
				useUnifiedTopology: true,
				useNewUrlParser: true
			}
		}),
		new transports.Console({
			json: false,
			colorize: true
		})
	]
})

const errorLogger = createLogger({
	transports: [
		new transports.Console({
			level: 'info',
			format: format.combine(format.splat(), format.simple()),
			colorize: true,
			handleExceptions: true
		}),
		new transports.MongoDB({
			level: 'error',
			db: connectionStr,
			collection: 'error_logs',
			options: {
				useUnifiedTopology: true,
				useNewUrlParser: true
			}
		})
	]
})

const articlesLogger = createLogger({
	transports: [
		new transports.Console({
			level: 'info',
			format: format.combine(format.splat(), format.simple()),
			colorize: true,
			handleExceptions: true
		}),
		new transports.MongoDB({
			level: 'info',
			db: connectionStr,
			collection: 'articles_logs',
			options: {
				useUnifiedTopology: true,
				useNewUrlParser: true
			}
		})
	]
})

const exceptionLogger = error => {
	errorLogger.error('Uncaught exception', { metadata: error })
	errorLogger.end(() => process.exit(1))
}

process.on('uncaughtException', exceptionLogger)
process.on('unhandledRejection', exceptionLogger)

module.exports = {
	mongooseLogger,
	errorLogger,
	articlesLogger
}
