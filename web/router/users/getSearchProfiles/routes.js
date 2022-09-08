const get = require('./get')
const i18n = require('../../../../locales')
const headerValidator = require('../../../middleware/validator')

module.exports = [
  {
    method: 'GET',
    path: 'users/search',
    /** @memberof signIn */
    handler: get.handler,
    options: {
      tags: ['api', 'users'],
      description: i18n.__('users.getSearch.description'),
      notes: i18n.__('users.getSearch.notes'),
      auth: {
        strategies: ['user']
      },
      validate: {
        /** @memberof payload */
        query: get.queryValidate, // payload validation
        /** @memberof headerValidator */
        headers: headerValidator.headerAccess, // header validation
        /** @memberof headerValidator */
        failAction: headerValidator.failAction
      },
      response: get.responseValidate // response validation
    }
  }
]
