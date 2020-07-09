exports.plugin = {
    pkg: {
        name: 'pre-handler-rule',
        version: '1.0.0'
    },
    register: function (server, options) {
        server.ext({
            type: 'onPreHandler',
            method: async function (request, h) {
                if (options.rules[request.url.pathname.toLowerCase()]){
                    const preResult = await options.rules[request.url.pathname.toLowerCase()](request);
                    if (preResult){
                        return h.response(preResult).takeover();
                    }
                }
                return h.continue;
            }
        });
    }
};
