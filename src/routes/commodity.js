// hapi-swagger guide
// https://github.com/glennjones/hapi-swagger/blob/master/usageguide.md

// joi guide
// https://github.com/hapijs/joi/blob/v14.3.0/API.md
import handlers from '../handlers/commodity';
import jois from '../utils/jois';
import Joi from '@hapi/joi';

export default [
    {
        method: 'POST',
        path: '/Commodity/Create',
        handler: handlers.create,
        config: {
            description: '创建',
            tags: ['api', 'commodity'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object().keys({
                    name: Joi.string().required(),
                    brand: Joi.string().required(),
                    categoryId: Joi.string().required(),
                    code: Joi.string().allow(null).allow(''),
                    photos: Joi.array(),
                    coverPhotos: Joi.array(),
                    description: Joi.string().required(),
                    subdivide: Joi.array()
                }).label('CreateCommodity')
            }
        }
    },
    {
        method: 'POST',
        path: '/Commodity/Update',
        handler: handlers.updateBasic,
        config: {
            description: '更新',
            tags: ['api', 'commodity'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object().keys({
                    id: jois.CommonJoi.id,
                    name: Joi.string().required(),
                    brand: Joi.string().required(),
                    categoryId: Joi.string().required(),
                    code: Joi.string().allow(null).allow(''),
                    photos: Joi.array(),
                    coverPhotos: Joi.array(),
                    description: Joi.string().required(),
                    subdivide: Joi.array()
                }).label('UpdateCommodity')
            }
        }
    },
    {
        method: 'GET',
        path: '/Commodity/SkuDetails',
        handler: handlers.skuDetails,
        config: {
            description: '查询Sku详情',
            tags: ['api', 'commodity'],
            auth: {
                scope: ['admin']
            },
            validate: {
                query: Joi.object().keys({
                    id: jois.CommonJoi.id
                }).label('SkuDetails')
            }
        }
    },
    {
        method: 'POST',
        path: '/Commodity/UpdateSkus',
        handler: handlers.updateSkus,
        config: {
            description: '更新Sku详情',
            tags: ['api', 'commodity'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object().keys({
                    id: jois.CommonJoi.id,
                    skus: Joi.array()
                }).label('UpdateSkus')
            }
        }
    },
    {
        method: 'POST',
        path: '/Commodity/Publish',
        handler: handlers.publish,
        config: {
            description: '上线',
            tags: ['api', 'commodity'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object().keys({
                    id: jois.CommonJoi.id
                }).label('Publish')
            }
        }
    },
    {
        method: 'POST',
        path: '/Commodity/Withdraw',
        handler: handlers.withdraw,
        config: {
            description: '下线',
            tags: ['api', 'commodity'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object().keys({
                    id: jois.CommonJoi.id
                }).label('Withdraw')
            }
        }
    },
    {
        method: 'POST',
        path: '/Commodity/Discard',
        handler: handlers.discard,
        config: {
            description: '废弃',
            tags: ['api', 'commodity'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object().keys({
                    id: jois.CommonJoi.id
                }).label('Discard')
            }
        }
    },
    {
        method: 'POST',
        path: '/Commodity/Copy',
        handler: handlers.copy,
        config: {
            description: '复制',
            tags: ['api', 'commodity'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object().keys({
                    id: jois.CommonJoi.id
                }).label('Copy')
            }
        }
    }
];
