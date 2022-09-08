
const joi = require('joi')

const envVarsSchema = joi.object({
  DEFAULT_LANGUAGE: joi.string().default('en'),
  LANGUAGES: joi.string().default('en')
}).unknown().required()

const { error, value: envVars } = envVarsSchema.validate(process.env)
if (error) {
  throw new Error(`localization validation error: ${error.message}`)
}

const config = {
  localization: {
    DEFAULT_LANGUAGE: envVars.DEFAULT_LANGUAGE,
    LANGUAGES: envVars.LANGUAGES
  }
}

module.exports = config
