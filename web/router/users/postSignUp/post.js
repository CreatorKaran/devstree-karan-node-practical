const Joi = require('joi')
const moment = require('moment')
const { ObjectID } = require('mongodb')
const path = require('path');
const bcrypt = require('bcrypt');

const config = require('../../../../config')
const usersDb = require('../../../../models/users')
const userTokenDb = require('../../../../models/userToken')
const logger = require('../../../commonModels/logger')
const i18n = require('../../../../locales')
const auth = require('../../../middleware/auth');
const fs = require('fs');
const uploadFolder = config.server.UPLOAD_FOLDER;


const payloadValidator = {
  maxBytes: 1000 * 1000 * 30, // 30 Mb
  output: 'stream',
  parse: true,
  allow: ['application/json', 'image/jpeg', 'multipart/form-data', 'image/png']
}// payload of upload image api

const payload = Joi.object({
  firstName:
    Joi.string().example('John').description('firstName : John').required(),
  lastName:
    Joi.string().example('Corner').description('lastName : Corner').default('').allow(''),
  password:
    Joi.string().example('12345').description('password : 12345').required(),
  email:
    Joi.string().email({ minDomainSegments: 2 }).description('email: john.corner@gmail.com').example('john.corner@gmail.com').required(),
  mobile:
    Joi.string().example('9988776655').description('mobile : 9988776655').required(),
  profilePic: Joi.any().meta({ swaggerType: 'file' }).required(),
  birthDate:
    Joi.date().iso().messages({ 'date.format': `Date format is YYYY-MM-DD` }).description('birthDate : 1997-06-08 (YYYY-MM-DD)').example('1997-06-08').required(),
})

const handler = async (req, h) => {
  // logger.debug('payload..', req.payload)
  // logger.debug('payload..', req.file)
  const userId = new ObjectID()
  let profilePic = ''

  const checkUserDetails = () => new Promise((resolve, reject) => {
    logger.info('checkUserDetails')

    const condition = {
      email: req.payload.email
    }
    return usersDb.getAll(condition)
      .then(data => {
        if (data.length > 0) reject({ message: i18n.__('users.response.409')['unique'], code: 409 })
        resolve()
      })
      .catch((err) => reject(err))
  })

  const handleFileUpload = file => {
    return new Promise((resolve, reject) => {

      const filename = userId.toString();
      const fileExt = path.extname(file.hapi.filename)

      const data = file._data
      fs.writeFile(`.${uploadFolder}/${filename}${fileExt}`, data, err => {
        if (err) {
          reject(err)
        }
        resolve({ message: 'Upload successfully!', path: `http://${config.server.HOST}:${config.server.PORT}/v1${uploadFolder}/${filename}${fileExt}` })
      })
    })
  }

  const addUser = () => new Promise(async (resolve, reject) => {
    logger.info('addUser')

    const originalPassword = req.payload.password
    req.payload.password = await bcrypt.hash(
      req.payload.password,
      Number(10)
    )

    const uplRes = await handleFileUpload(req.payload.profilePic)

    console.log('uplRes...', uplRes);
    profilePic = uplRes.path || '';
    const insertData = {
      _id: userId,
      userId: String(userId),
      firstName: req.payload.firstName,
      lastName: req.payload.lastName,
      fullName: `${req.payload.firstName} ${req.payload.lastName}`,
      originalPassword: originalPassword,
      password: req.payload.password,
      email: req.payload.email,
      mobile: req.payload.mobile,
      profilePic,
      dateOfBirth: req.payload.birthDate,
      dateOfBirthTimeStamp: moment(req.payload.birthDate).unix(),
      createdOnDt: moment().toDate(),
      createdOn: moment().unix()
    }
    return usersDb.insertOne(insertData)
      .then(async data => {
        resolve(await usersDb.getOne({ _id: data.insertedId }))
      })
      .catch((err) => reject(err))
  })

  const generateResponse = (user) => new Promise((resolve) => {
    logger.info('generateResponse')

    const response = {
      _id: userId,
      userId: String(userId),
      firstName: req.payload.firstName,
      lastName: req.payload.lastName,
      fullName: `${req.payload.firstName} ${req.payload.lastName}`,
      token: '',
      email: req.payload.email,
      mobile: req.payload.mobile,
      profilePic,
      dateOfBirth: req.payload.birthDate,
      dateOfBirthTimeStamp: moment(req.payload.birthDate).unix(),
      createdOnDt: user.createdOnDt,
      createdOn: user.createdOn
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

  // return checkUserDetails()
  return addUser()
    // .then(addUser)
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
    409: Joi.object({
      message: Joi.any().example(i18n.__('users.response.409.unique')).description(i18n.__('common.responseDescription.409'))
    }).description(i18n.__('common.responseDescription.409')),
    200: Joi.object({
      message: Joi.any().example(i18n.__('common.response.200')).description(i18n.__('common.responseDescription.200')),
      data: Joi.object({
        _id: '6069700d845630355064246d',
        userId: '6069700d845630355064246d',
        firstName: 'John',
        lastName: 'Corner',
        token: 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDcxY2E3O',
        countryCode: '+91',
        mobile: '9988776655',
        email: 'john@gmail.com',
        createdOnDt: '2021-04-04T07:51:41.344Z',
        createdOn: '1617522701'
      })
    }).description(i18n.__('common.responseDescription.200'))
  },
  failAction: 'log'
}// swagger response code

module.exports = {
  payload,
  payloadValidator,
  handler,
  responseValidate
}
