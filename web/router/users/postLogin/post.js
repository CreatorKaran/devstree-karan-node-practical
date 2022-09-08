const Joi = require('joi')
const moment = require('moment')
const { ObjectID } = require('mongodb')

const bcrypt = require('bcrypt');

const config = require('../../../../config')
const usersDb = require('../../../../models/users')
const userTokenDb = require('../../../../models/userToken')
const logger = require('../../../commonModels/logger')
const i18n = require('../../../../locales')
const auth = require('../../../middleware/auth');

const payloadValidate = Joi.object({
  email:
    Joi.string().email({ minDomainSegments: 2 }).description('email: karan.sojitra2@gmail.com').example('john.corner@gmail.com').required(),
  password:
    Joi.string().example('12345').description('password : 12345').required()
})

const handler = async (req, h) => {
  logger.debug('payload..', req.payload)
  let userId = ''
  let userData = null
  const checkUserDetails = () => new Promise((resolve, reject) => {
    logger.info('checkUserDetails')

    const condition = { email: req.payload.email }
    return usersDb.getOne(condition)
      .then(async (data) => {
        if (!data) reject({ message: i18n.__('users.response.404')['invalidMobile'], code: 404 })

        userId = String(data._id)
        userData = data

        const isPasswordValid = await bcrypt.compare(
          req.payload.password,
          userData.password
        )

        if (isPasswordValid === false) {
          return reject({ message: i18n.__('users.response.408'), code: 408 })
        }
        resolve()
      })
      .catch((err) => reject(err))
  })

  const generateResponse = () => new Promise((resolve) => {
    logger.info('generateResponse')

    const response = {
      userId: userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      fullName: userData.fullName,
      token: '',
      email: userData.email,
      mobile: userData.mobile,
      dateOfBirth: userData.dateOfBirth,
      dateOfBirthTimeStamp: userData.dateOfBirthTimeStamp,
    }

    return resolve(response)

  })

  const genrerateToken = (response) => new Promise((resolve, reject) => {
    logger.info('genrerateToken')

    const authData = {
      userId: response.userId,
      userType: 'user',
      accessTTL: config.ACCESSTTL
    }

    return auth.generateTokens(authData)
      .then(async (data) => {
        response.token = data

        const userTokenData = {
          userId: response.userId,
          token: data,
          createdAt: moment().unix()
        }

        await userTokenDb.insertOrUpdate({ userId: response.userId }, { $set: userTokenData })  // add issued token data to db to delete later on logout
        return resolve(response)
      })
      .catch(err => reject(err))
  })

  return checkUserDetails()
    .then(generateResponse)
    .then(genrerateToken)
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
    408: Joi.object({
      message: Joi.any().example(i18n.__('users.response.408')).description(i18n.__('common.responseDescription.408'))
    }).description(i18n.__('common.responseDescription.408')),
    404: Joi.object({
      message: Joi.any().example(i18n.__('users.response.404.invalidEmail')).description(i18n.__('common.responseDescription.404'))
    }).description(i18n.__('common.responseDescription.404')),
    200: Joi.object({
      message: Joi.any().example(i18n.__('common.response.200')).description(i18n.__('common.responseDescription.200')),
      data: Joi.object({
        userId: '6069700d845630355064246d',
        firstName: 'John',
        lastName: 'Corner',
        fullName: 'John Corner',
        token: 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDcxY2E3O',
        mobile: '9988776655',
        email: 'john@gmail.com',
        dateOfBirth: '1997-06-08',
        dateOfBirthTimeStamp: 865728000,
      })
    }).description(i18n.__('common.responseDescription.200'))
  },
  failAction: 'log'
}// swagger response code

module.exports = {
  payloadValidate,
  handler,
  responseValidate
}
