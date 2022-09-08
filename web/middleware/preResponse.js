exports.plugin = {
    name: 'pre-response',
    version: '1.0.0',
    register: (server) => {
      server.ext('onPreResponse', (req, h) => {
        if (req.response.isServer) {
          return h.response({
            message: 'Internal Error'
          }).code(500).takeover()
        }
        return h.continue
      })
    }
  }
  