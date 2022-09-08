const post = require('./post')
const i18n = require('../../../../locales')
const headerValidator = require('../../../middleware/validator')
module.exports = [
  {
    method: 'POST',
    path: 'users/signUp',
    /** @memberof signIn */
    handler: post.handler,
    options: {
      tags: ['api', 'users'],
      description: i18n.__('users.postSignUp.description'),
      notes: i18n.__('users.postSignUp.notes'),
      payload: {
        maxBytes: 1000 * 1000 * 30, // 30mb
        output: 'stream',
        parse: true,
        multipart: true,
        timeout: 30034,
        // allow: 'multipart/form-data',
        failAction: headerValidator.failAction,
      },
      validate: {
        /** @memberof payload */
        payload: post.payload, // payload validation
        /** @memberof headerValidator */
        // headers: headerValidator.headerAccess, // header validation
        /** @memberof headerValidator */
        failAction: headerValidator.failAction
      },
      plugins: {
        'hapi-swagger': {
          payloadType: 'form'
        }
      },
      response: post.responseValidate // response validation
    }
  }
]
