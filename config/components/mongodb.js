
const joi = require('joi')

const envVarsSchema = joi.object({
  MONGO_URL: joi.string().required(),
  MONGO_DATABASE: joi.string().required()
}).unknown().required()

const { error, value: envVars } = envVarsSchema.validate(process.env)
if (error) {
  throw new Error(`MongoDb validation error: ${error.message}`)
}

const config = {
  mongodb: {
    URL: envVars.MONGO_URL,
    DBNAME: envVars.MONGO_DATABASE
  }
}

module.exports = config
