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
    },
    {
        method: 'POST',
        path: '/Client/wxCheckToken',
        handler: handlers.wxCheckToken,
        config: {
            description: '微信验证Token',
            tags: ['api', 'admin'],
            auth: false,
            validate: {
                payload: Joi.object().keys({
                    token: Joi.string().required()
                }).label('wxCheckToken')
            }
        }
    },
    {
        method: 'POST',
        path: '/Client/wxRegisterComplex',
        handler: handlers.wxRegisterComplex,
        config: {
            description: '微信注册',
            tags: ['api', 'admin'],
            auth: false,
            validate: {
                payload: Joi.object().keys({
                    code: Joi.string().required(),
                    encryptedData: Joi.string(),
                    iv: Joi.string(),
                    referrer: Joi.string().allow(null).allow(''),
                }).label('wxRegisterComplex')
            }
        }
    },
    {
        method: 'POST',
        path: '/Client/wxLogin',
        handler: handlers.wxLogin,
        config: {
            description: '微信登录',
            tags: ['api', 'admin'],
            auth: false,
            validate: {
                payload: Joi.object().keys({
                    code: Joi.string().required()
                }).label('wxLogin')
            }
        }
    },
    {
        method: 'POST',
        path: '/Client/wxBasic',
        handler: handlers.wxBasic,
        config: {
            description: '用户基本信息',
            tags: ['api', 'admin'],
            auth: false,
            validate: {
                payload: Joi.object().keys({
                    uid: Joi.string().required()
                }).label('wxBasic')
            }
        }
    }
];
