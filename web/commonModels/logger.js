const { createLogger, format, transports } = require('winston')
const config = require('../../config')

// eslint-disable-next-line no-unused-vars
const logFormat = format.combine(
    format.colorize(),
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.align(),
    format.printf((info) => {
        const stringifiedRest = JSON.stringify({
            ...info,
            timestamp: undefined,
            level: undefined,
            message: undefined,
            splat: undefined
        })

        // eslint-disable-next-line no-mixed-operators
        const padding = info.padding && info.padding[info.level] || ''
        if (stringifiedRest !== '{}') {
            return `${info.timestamp} ${info.level}:${padding} ${info.message} ${stringifiedRest}`
        }
        return `${info.timestamp} ${info.level}:${padding} ${info.message}`
    })
)

const logger = createLogger({
    level: config.logger.LEVEL || 'silly',
    format: logFormat,
    exitOnError: false,
    transports: [
        new transports.Console()
    ]
})

module.exports = logger
