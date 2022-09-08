
const Joi = require('joi')
const lan = require('./localization')
const i18n = require('../../locales')
const logger = require('../commonModels/logger')

const headerAccess = Joi.object({
    authorization: Joi.string()
        .required()
        .description(i18n.__('common.fields.authorization')),
}).unknown();

const failAction = (req, h, err) => {
    if (err.isJoi || Array.isArray(err.details)) {
        logger.debug('req payload : ', req.payload)
        logger.debug('req query : ', req.query)
        logger.debug('JOI error : ', err.details[0])
        const invalidItem = err.details[0]
        return h.response({
            message: req.i18n.__('common.response.400', invalidItem.path.join(','))
        }).code(400).takeover()
    }
    
    logger.error('Other Error : ', err)
    return h.response({
        message: req.i18n.__('common.response.500')
    }).code(500).takeover()
}

module.exports = {
    headerAccess,
    failAction
}
