exports.plugin = {
    pkg: {
        name: 'default-jwt',
        version: '1.0.0'
    },
    register: function (server, options) {
        server.ext({
            type: 'onRequest',
            method: function (request, h) {
                if (!request.headers.authorization){
                    request.headers.authorization = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwiZmlyc3ROYW1lIjoidXNlcm5hbWUiLCJsYXN0TmFtZSI6InVzZXJuYW1lIiwicm9sZSI6ImFkbWluIiwiaWQiOiJ1c2VybmFtZSIsInNjb3BlIjpbImFkbWluIl0sImlhdCI6MTU4MjQ2NjkyMywiZXhwIjoyNzUwMjQ2NjkyM30.rzOUqa7U1gwC8mASmtTjz9DlF5cTfHegxR6hKV-sELM';
                }
                return h.continue;
            }
        });
    }
};
