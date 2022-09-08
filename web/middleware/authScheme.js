const register = async server => {
    // adding auth stretegies
    server.auth.strategy('user', 'devstree')
  }
  
  exports.plugin = {
    name: 'authScheme',
    version: '1.0.0',
    register
  }
  