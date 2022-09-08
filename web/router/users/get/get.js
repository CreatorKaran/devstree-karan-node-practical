const Joi = require('joi')
const usersDb = require('../../../../models/users')

const logger = require('../../../commonModels/logger')
const i18n = require('../../../../locales')

const handler = async (req, h) => {
  logger.debug('queryData..', req.query)
  logger.debug('req.auth..', req.auth.credentials)

  const userId = req.auth.credentials._id

  const getUserDetails = () => new Promise((resolve, reject) => {
    return usersDb.getOne({ userId: userId }, { password: 0, originalPassword: 0, _id: 0 })
      .then(data => {
        if (!data) reject({ message: i18n.__('users.response.404')['notFound'], code: 404 })
        resolve(data)
      })
      .catch((err) => reject(err))
  })

  return getUserDetails()
    .then((data) => {
      delete data.password
      delete data.originalPassword
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
    404: Joi.object({
      message: Joi.any().example(i18n.__('common.response.404')).description(i18n.__('common.responseDescription.404'))
    }).description(i18n.__('common.responseDescription.404')),
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
