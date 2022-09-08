const get = require('./get')
const i18n = require('../../../../locales')
const headerValidator = require('../../../middleware/validator')

module.exports = [
  {
    method: 'GET',
    path: 'users/profile',
    /** @memberof signIn */
    handler: get.handler,
    options: {
      tags: ['api', 'users'],
      description: i18n.__('users.getProfile.description'),
      notes: i18n.__('users.getProfile.notes'),
      auth: {
        strategies: ['user']
      },
      validate: {
        /** @memberof payload */
        // query: get.queryValidate, // payload validation
        /** @memberof headerValidator */
        headers: headerValidator.headerAccess, // header validation
        /** @memberof headerValidator */
        failAction: headerValidator.failAction
      },
      response: get.responseValidate // response validation
    }
  },
  {  
    method: 'GET',
    path: 'upload/{file*}',
    handler: {
      directory: { 
        path: 'upload/',
        listing: false
      }
    }
  }
]
