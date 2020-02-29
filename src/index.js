import Config from 'getconfig';
import Pack from './../package';
import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import File from './routes/file';
import Demo from './routes/demo';
import Joi from '@hapi/joi';
import mongoose from 'mongoose';
import RestHapi from 'rest-hapi';
import {configAuth} from './utils/auth/auth';

const connectionConfig = Config.connectConfig;

connectionConfig.routes.validate = {
    failAction: (request, h, err) => {
        if (process.env.NODE_ENV === 'production') {
            // In prod, log a limited error message and throw the default Bad Request error.
            console.error('ValidationError:', err.message);
            throw Boom.badRequest(`Invalid request payload input`);
        }
        else {
            // During development, log and respond with the full error.
            console.error(err);
            throw err;
        }
    }
};

const server = new Hapi.Server(connectionConfig);

server.validator(Joi);

const init = async () => {
    await server.register([
        {
            plugin: RestHapi,
            options: {
                mongoose,
                config:{
                    appTitle: 'My API',
                    modelPath: 'src/schemas'
                }
            }
        },
        require('@hapi/inert'),
        require('@hapi/vision'),
        require('blipp'),
        {
            plugin: require('hapi-swagger'),
            options: {
                info: {
                    title: 'API Documentation',
                    version: Pack.version
                },
                schemes: [Config.swaggerSchemes || 'http'],
                grouping: 'tags',
                securityDefinitions: {
                    jwt: {
                        type: 'apiKey',
                        name: 'Authorization',
                        in: 'header'
                    }
                }
            }
        },
        {
            plugin: require('@hapi/good'),
            options: Config.goodConfig
        },
        require('./plugins/route-error-handler'),
        {
            plugin: require('hapi-rbac'),
            options: {
            }
        }
    ]);

    await configAuth(server);

    server.route(File);
    server.route(Demo);

    server.route({
        method: 'GET',
        path: '/resources/{param*}',
        handler: {
            directory: {
                path: './public/resources'
            }
        }
    });

    try {
        await server.start();
        console.log('Server running at:', server.info.uri);
    }
    catch (err) {
        console.log(err);
    }
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();

export default server;
