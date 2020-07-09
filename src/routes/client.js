// hapi-swagger guide
// https://github.com/glennjones/hapi-swagger/blob/master/usageguide.md

// joi guide
// https://github.com/hapijs/joi/blob/v14.3.0/API.md
import handlers from '../handlers/client';
import Joi from '@hapi/joi';

export default [
    {
        method: 'POST',
        path: '/Client/wxSignin',
        handler: handlers.wxSignin,
        config: {
            description: '微信登录',
            tags: ['api', 'admin'],
            auth: false,
            validate: {
                payload: Joi.object().keys({
                    code: Joi.string().required()
                }).label('wxSignin')
            }
        }
    }
];
