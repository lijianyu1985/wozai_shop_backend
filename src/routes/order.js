// hapi-swagger guide
// https://github.com/glennjones/hapi-swagger/blob/master/usageguide.md

// joi guide
// https://github.com/hapijs/joi/blob/v14.3.0/API.md
import handlers from '../handlers/order';
import Joi from '@hapi/joi';
import jois from '../utils/jois';

export default [
    {
        method: 'POST',
        path: '/Order/Cancel',
        handler: handlers.cancel,
        config: {
            description: '取消订单',
            tags: ['api', 'order'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object().keys({
                    id: jois.CommonJoi.id,
                }).label('/Order/Cancel')
            }
        }
    },
    {
        method: 'POST',
        path: '/Order/CreateShipping',
        handler: handlers.createShipping,
        config: {
            description: '创建快递',
            tags: ['api', 'order'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object().keys({
                    id: jois.CommonJoi.id,
                    sender: Joi.object().keys({
                        province: Joi.string().allow(null),
                        city: Joi.string().allow(null),
                        county: Joi.string().allow(null),
                        zipCode: Joi.string().allow(null),
                        name: Joi.string().allow(null),
                        phone: Joi.string().allow(null),
                        address: Joi.string().allow(null),
                    }),
                    receiver: Joi.object().keys({
                        province: Joi.string().allow(null),
                        city: Joi.string().allow(null),
                        county: Joi.string().allow(null),
                        zipCode: Joi.string().allow(null),
                        name: Joi.string().allow(null),
                        phone: Joi.string().allow(null),
                        address: Joi.string().allow(null),
                    }),
                    count: Joi.number().allow(null),
                    weight: Joi.number().allow(null),
                }).label('/Order/CreateShipping')
            }
        }
    },
    {
        method: 'GET',
        path: '/Order/Get',
        handler: function (request, h) {
            return 'images';
        },
        config: {
            description: '查询单个',
            tags: ['api', 'admin']
        }
    },
    {
        method: 'POST',
        path: '/Order/ApplyDiscount',
        handler: handlers.applyDiscount,
        config: {
            description: '给与优惠',
            tags: ['api', 'order'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object().keys({
                    id: jois.CommonJoi.id,
                    discount: Joi.number().allow(null),
                }).label('/Order/ApplyDiscount')
            }
        }
    },
];
