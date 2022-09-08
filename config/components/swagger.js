
const joi = require('joi')

const envVarsSchema = joi.object({
  SWAGGERHOST: joi.string().required(),
  SWAGGERTITLE: joi.string().required(),
  SWAGGERVERSION: joi.string().required(),
  SWAGGERAUTHORNAME: joi.string().required(),
  SWAGGERAUTHOREMAIL: joi.string().required(),
}).unknown().required()

const { error, value: envVars } = envVarsSchema.validate(process.env)
if (error) {
  throw new Error(`Swagger validation error: ${error.message}`)
}

const config = {
  swagger: {
    HOST: envVars.SWAGGERHOST,
    TITLE: envVars.SWAGGERTITLE,
    VERSION: envVars.SWAGGERVERSION,
    AUTHORNAME: envVars.SWAGGERAUTHORNAME,
    AUTHOREMAIL: envVars.SWAGGERAUTHOREMAIL
  }
}

module.exports = config
