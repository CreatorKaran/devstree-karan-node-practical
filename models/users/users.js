/* eslint-disable no-return-await */

const db = require('../../library/mongodb')

const tableName = 'users'

/**
 * get multiple product with params
 * @param {*} params
 */
const insertOne = async (params) => await db
  .get()
  .collection(tableName)
  .insertOne(params)

const getOne = async (cond = {}, proj = {}) => await db
  .get()
  .collection(tableName)
  .findOne(cond, { projection: proj })

const getAll = async (cond = {}, proj = {}, limit = 20, skip = 0, sort = {}) => await db
  .get()
  .collection(tableName)
  .find(cond, { projection: proj })
  .limit(limit)
  .skip(skip)
  .sort(sort)
  .toArray()

module.exports = {
  insertOne, getOne, getAll
}
