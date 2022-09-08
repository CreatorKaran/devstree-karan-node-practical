const i18n = require('i18n')
const config = require('../web/middleware/localization').i18n.options

i18n.configure(config)

module.exports = i18n
