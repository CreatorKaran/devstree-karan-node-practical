const users = require('./users')


const allRoutes = [].concat(users)
const register = (server) => {
  server.route(allRoutes)
}

exports.plugin = {
  name: 'base-routes',
  version: '1.0.0',
  register
}
