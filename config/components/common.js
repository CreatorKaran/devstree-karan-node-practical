
const joi = require('joi')

const envVarsSchema = joi.object({
  AUTH_KEY: joi.string().required(),
  ACCESSTTL: joi.string().required(),
  IP_INFO_TOKEN: joi.string().required()
}).unknown().required()

const { error, value: envVars } = envVarsSchema.validate(process.env)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  AUTH_KEY: envVars.AUTH_KEY,
  ACCESSTTL: envVars.ACCESSTTL,
  IPINFOTOKEN: envVars.IP_INFO_TOKEN
}

module.exports = config
