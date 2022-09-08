/* eslint-disable no-return-await */

const db = require('../../library/mongodb')

const tableName = 'userTokens'

/**
 * get multiple product with params
 * @param {*} params
 */
const insertOne = async (params) => await db
  .get()
  .collection(tableName)
  .insertOne(params)

const getOne = async (cond) => await db
  .get()
  .collection(tableName)
  .findOne(cond)

const insertOrUpdate = async (cond, update) => await db
  .get()
  .collection(tableName)
  .findOneAndUpdate(cond, update, { upsert: true })

const deleteOne = async (cond) => await db
  .get()
  .collection(tableName)
  .findOneAndDelete(cond)

module.exports = {
  insertOne, getOne, insertOrUpdate, deleteOne
}
