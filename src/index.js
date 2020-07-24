import Config from 'getconfig';
import Pack from './../package';
import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import AdminAuth from './routes/adminAuth';
import AdminManagement from './routes/adminManagement';
import AdminProfile from './routes/adminProfile';
import Client from './routes/client';
import File from './routes/file';
import Demo from './routes/demo';
import Common from './routes/common';
import Commodity from './routes/commodity';
import CommodityWx from './routes/commodity.wx';
import Joi from '@hapi/joi';
import {configAuth} from './utils/auth/auth';
import {policy} from './utils/auth/rbacPolicy';

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
        {
            plugin: require('hapi-mongoose2'),
            options: Config.mongoConfig
        },
        require('./plugins/route-error-handler'),
        {
            plugin: require('hapi-rbac'),
            options: {
                policy,
                responseCode: {
                    onDeny: 403,
                    onUndetermined: 403
                }
            }
        },
        {
            plugin: require('./plugins/pre-handler-rule'),
            options: {
                rules: require('./handlers/rules').default
            }
        }
    ]);

    await configAuth(server);

    server.route(AdminAuth);
    server.route(AdminManagement);
    server.route(AdminProfile);
    server.route(Client);
    server.route(File);
    server.route(Demo);
    server.route(Common);
    server.route(Commodity);
    server.route(CommodityWx);

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
