
const postSignUp = require('./postSignUp')
const postLogin = require('./postLogin')
const get = require('./get')
const postLogout = require('./postLogout')
const getSearchProfiles = require('./getSearchProfiles')

module.exports = [].concat(postSignUp, postLogin, get, postLogout, getSearchProfiles)
