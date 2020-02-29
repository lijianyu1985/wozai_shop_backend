exports.plugin = {
    pkg: {
        name: 'route-error-handler',
        version: '1.0.0'
    },
    register: function (server, options) {
        server.ext({
            type: 'onPreResponse',
            method: function (request, h) {
                if (request.response instanceof Error)  {
                    request.server.log('error', Object.assign({
                        message: request.response.message,
                        name: request.response.name,
                        stack: request.response.stack
                    }, request.response));
                }
                return h.continue;
            }
        });
    }
};
