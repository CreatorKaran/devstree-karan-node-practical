
const joi = require('joi')

const envVarsSchema = joi.object({
  HOST: joi.string().required(),
  PORT: joi.number().required(),
  VERSION: joi.string().required(),
  UPLOAD_FOLDER: joi.string().required()
}).unknown().required()

const { error, value: envVars } = envVarsSchema.validate(process.env)
if (error) {
  throw new Error(`Server validation error: ${error.message}`)
}

const config = {
  server: {
    HOST: envVars.HOST,
    PORT: envVars.PORT,
    VERSION: envVars.VERSION,
    UPLOAD_FOLDER: envVars.UPLOAD_FOLDER
  }
}

module.exports = config
