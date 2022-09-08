const MongoClient = require('mongodb').MongoClient
const config = require('../../config')
const logger = require('../../web/commonModels/logger')

/**
 * Method to connect to the mongodb
 * @param {*} url
 * @returns connection object
 */

const url = config.mongodb.URL
let _db
let client

const dbName = config.mongodb.DBNAME
module.exports = {
  // method is use for connect db to server
  async connect() {
    // Use connect method to connect to the Server
    client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).catch((err) => {
      logger.error(`MongoDB error connecting to ${url}`, err.message)
    })
    logger.info(`MongoDB connected successfully for db ${dbName}-------------`)


    _db = client.db(dbName)
    return client
  },

  async closeConnection() {
    client.close()
  },

  // export db instance
  get() {
    return _db
  }
}
