
const hapiSwagger = require('hapi-swagger')
const inert = require('@hapi/inert')
const vision = require('@hapi/vision')
const config = require('../../config')

const swagger = {
  plugin: hapiSwagger,
  options: {
    schemes: ['http'],
    host: config.swagger.HOST,
    swaggerUIPath: `/${config.server.VERSION}/swaggerui/`,
    jsonPath: `/${config.server.VERSION}/swagger.json`,
    // defaultModelExpandDepth: '-1',
    documentationPath: `/${config.server.VERSION}/doc`,
    grouping: 'tags',
    cors: false,
    debug: true,
    // payloadType: 'form',
    info: {
      title: config.swagger.TITLE,
      version: config.swagger.VERSION,
      contact: {
        name: config.swagger.AUTHORNAME,
        email: config.swagger.AUTHOREMAIL
      }
    }
  }
}

module.exports = { inert, vision, swagger }
