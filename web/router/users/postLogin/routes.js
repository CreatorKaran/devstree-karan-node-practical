const post = require('./post')
const i18n = require('../../../../locales')
const headerValidator = require('../../../middleware/validator')
module.exports = [
  {
    method: 'POST',
    path: 'users/login',
    /** @memberof signIn */
    handler: post.handler,
    options: {
      tags: ['api', 'users'],
      description: i18n.__('users.postSignIn.description'),
      notes: i18n.__('users.postSignIn.notes'),
      validate: {
        /** @memberof payload */
        payload: post.payloadValidate, // payload validation
        /** @memberof headerValidator */
        // headers: headerValidator.headerAccess, // header validation
        /** @memberof headerValidator */
        failAction: headerValidator.failAction
      },
      response: post.responseValidate // response validation
    }
  }
]
