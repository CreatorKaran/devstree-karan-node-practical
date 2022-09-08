
const joi = require('joi')
const jwt = require('jsonwebtoken');
const config = require('../../config')
const userTokenDb = require('../../models/userToken')



// const Promise = require('bluebird');
const internals = {}
exports.plugin = {
  name: 'authorization',
  version: '1.0.0',
  async register(server) { // , options) {
    server.auth.scheme('devstree', internals.implementation)
  }
}

internals.implementation = () => ({

  async authenticate(req, h) {
    const token = req.headers.authorization
    const unAuth = { message: 'Unauthorised' }
    if (token === '') {
      return h.response(unAuth).code(401).takeover()
    }

    return decodeToken(token)
      .then(async (data) => {

        if (req._route.settings.auth.strategies.indexOf(data.userType) !== -1) {
          // do nothing
        } else {
          return h.response(unAuth).code(401).takeover()
        }


        const tokenData = data
        const id = tokenData.userId

        const credentials = {
          _id: id,
          sub: tokenData.userType,
          metaData: tokenData.metaData
        }
        try {
          const tokenFound = await userTokenDb.getOne({ userId: id, token: req.headers.authorization})

          if(!tokenFound) {
            return h.response({message: 'Blocked token'}).code(406).takeover()
          }
        } catch (err) {

        }

        return h.authenticated({
          credentials,
          artifacts: data
        })
      })
      .catch((err) => {
        console.log(err)
        return h.response({ message: err.message }).code(err.code).takeover()
      })


  },
  response(req, h) {
    return h.continue
  }
})

const decodeToken = (token) => new Promise(async (resolve, reject) => {
  try {
    token = token && token.split(' ')[1]
    if (!token) return reject({ message: 'Unauthorized', code: 401 })
    var decoded = await jwt.verify(token, config.AUTH_KEY, { algorithm: 'HS512' })

    return resolve(JSON.parse(JSON.stringify(decoded)))
  } catch (err) {
    err = JSON.parse(JSON.stringify(err))

    const error = {
      message: 'Invalid Token',
      code: 403
    }
    switch (err.message) {
      case 'jwt expired':
        console.log('case: jwt expired')
        error.message = 'Token Expired'
        error.code = 406
        break

      case 'invalid signature':
        console.log('case: invalid signature')

        error.message = 'Unauthorised'
        error.code = 401
        break
    }
    return reject(error)
  }
})

const genTokenSchema = joi.object({
  userId: joi.string().required(),
  userType: joi.string().required(),
  accessTTL: joi.string().optional().default('3600s')
}).unknown().required()


exports.generateTokens = user => new Promise(async (resolve, reject) => {
  const { error, value } = genTokenSchema.validate(user)
  if (error) {
    return reject(error)
  }

  value.type = 'Bearer'
  let token = await jwt.sign(value, config.AUTH_KEY, {
    algorithm: 'HS512',
    expiresIn: value.accessTTL
  })
  token = 'Bearer ' + token
  return resolve(token)
})