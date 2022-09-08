const hapiI18n = require('hapi-i18n')
const config = require('../../config')

const { DEFAULT_LANGUAGE, LANGUAGES } = config.localization

const i18n = {
  plugin: hapiI18n,
  options: {
    locales: LANGUAGES.split(','),
    directory: './locales',
    languageHeaderField: 'lan',
    defaultLocale: DEFAULT_LANGUAGE,
    objectNotation: true
  }
}

module.exports = { i18n, DEFAULT_LANGUAGE, LANGUAGES }
