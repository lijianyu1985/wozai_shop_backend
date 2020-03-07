// hapi-swagger guide
// https://github.com/glennjones/hapi-swagger/blob/master/usageguide.md

// joi guide
// https://github.com/hapijs/joi/blob/v14.3.0/API.md
import handlers from '../handlers/common';
import jois from '../utils/jois';
import Joi from '@hapi/joi';

export default [
    {
        method: 'GET',
        path: '/Common/Page',
        handler: handlers.pageQuery,
        config: {
            description: '分页查询',
            tags: ['api', 'common'],
            auth: {
                scope: ['admin', 'client']
            },
            validate: {
                query: {
                    modelName: Joi.string().trim().required(),
                    query: Joi.string().allow(null).allow(''),
                    sort: Joi.string().allow(null).allow(''),
                    selector: Joi.string().trim().allow(null).allow(''),
                    page: Joi.number().min(0).allow(null),
                    size: Joi.number().min(1).allow(null)
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/Common/Find',
        handler: handlers.find,
        config: {
            description: '查询',
            tags: ['api', 'common'],
            auth: {
                scope: ['admin', 'client']
            },
            validate: {
                query: {
                    modelName: Joi.string().trim().required(),
                    query: Joi.string().allow(null).allow(''),
                    sort: Joi.string().allow(null).allow(''),
                    selector: Joi.string().trim().allow(null).allow('')
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/Common/Create',
        handler: handlers.create,
        config: {
            description: '创建',
            tags: ['api', 'common'],
            auth: {
                scope: ['admin', 'client']
            },
            validate: {
                payload: Joi.object().keys({
                    modelName: Joi.string().trim().required(),
                    data: Joi.string().allow(null).allow(''),
                    opts: Joi.string().allow(null).allow('')
                }).label('CreateModel')
            }
        }
    },
    {
        method: 'POST',
        path: '/Common/Update',
        handler: handlers.update,
        config: {
            description: '更新',
            tags: ['api', 'common'],
            auth: {
                scope: ['admin', 'client']
            },
            validate: {
                payload: Joi.object().keys({
                    modelName: Joi.string().trim().required(),
                    id: jois.CommonJoi.optionalId,
                    query: Joi.string().allow(null).allow(''),
                    data: Joi.string().allow(null).allow(''),
                    opts: Joi.string().allow(null).allow('')
                }).label('UpdateModel')
            }
        }
    },
    {
        method: 'DELETE',
        path: '/Common/Delete',
        handler: handlers.remove,
        config: {
            description: '删除',
            tags: ['api', 'common'],
            auth: {
                scope: ['admin', 'client']
            },
            validate: {
                payload: Joi.object().keys({
                    modelName: Joi.string().trim().required(),
                    id: jois.CommonJoi.optionalId,
                    query: Joi.string().allow(null).allow('')
                }).label('RemoveModel')
            }
        }
    },
    {
        method: 'GET',
        path: '/Common/Get',
        handler: handlers.get,
        config: {
            description: '查询单个',
            tags: ['api', 'common'],
            auth: {
                scope: ['admin', 'client']
            },
            validate: {
                query: {
                    modelName: Joi.string().trim().required(),
                    selector: Joi.string().trim().allow(null).allow(''),
                    id: jois.CommonJoi.id
                }
            }
        }
    }
];
