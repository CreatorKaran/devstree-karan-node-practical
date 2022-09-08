const Joi = require('joi')
const userTokenDb = require('../../../../models/userToken')
const logger = require('../../../commonModels/logger')
const i18n = require('../../../../locales')

const handler = async (req, h) => {

  logger.debug('req.auth..', req.auth.credentials)

  const logoutAndBlockToken = () => new Promise((resolve, reject) => {
    logger.info('logoutAndBlockToken')

    return userTokenDb.deleteOne({ userId: req.auth.credentials._id })
      .then(() => resolve())
      .catch(err => reject(err))
  })

  return logoutAndBlockToken()
    .then((data) => {
      return h.response({
        message: i18n.__('common.response')['200'],
        data: data
      }).code(200)
    })
    .catch((err) => {
      logger.error('errrr...', err)

      if (err instanceof Error) {
        return h.response({ message: i18n.__('common.response')['500'] }).code(500)
      }
      return h.response({ message: err.message }).code(err.code)
    })
}

const responseValidate = {
  status: {
    500: Joi.object({
      message: Joi.any().example(i18n.__('common.response.500')).description(i18n.__('common.responseDescription.500'))
    }).description(i18n.__('common.responseDescription.500')),
    400: Joi.object({
      message: Joi.any().example(i18n.__('common.response.400')).description(i18n.__('common.responseDescription.400'))
    }).description(i18n.__('common.responseDescription.400')),
    200: Joi.object({
      message: Joi.any().example(i18n.__('common.response.200')).description(i18n.__('common.responseDescription.200'))
    }).description(i18n.__('common.responseDescription.200'))
  },
  failAction: 'log'
}// swagger response code

module.exports = {
  handler,
  responseValidate
}
