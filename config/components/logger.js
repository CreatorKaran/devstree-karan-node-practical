
const joi = require('joi')

const envVarsSchema = joi.object({
  LOGGER_LEVEL: joi.string()
    .valid('silly')
    .default('silly')


}).unknown().required()

const { error, value: envVars } = envVarsSchema.validate(process.env)
if (error) {
  throw new Error(`logger validation error: ${error.message}`)
}

const config = {
  logger: {
    LEVEL: envVars.LOGGER_LEVEL
  }
}

module.exports = config
