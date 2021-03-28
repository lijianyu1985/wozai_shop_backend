// hapi-swagger guide
// https://github.com/glennjones/hapi-swagger/blob/master/usageguide.md

// joi guide
// https://github.com/hapijs/joi/blob/v14.3.0/API.md
import rbacPolicy from '../utils/auth/rbacPolicy';
import handlers from '../handlers/order';
import Joi from '@hapi/joi';
import jois from '../utils/jois';

export default [
    {
        method: 'GET',
        path: '/Wx/Order/RetryLatestCeated',
        handler: handlers.wxRetryLatestCeated,
        config: {
            description: '查询',
            tags: ['api', 'admin'],
            auth: {
              scope: "wx",
            },
        }
    },
    {
        method: 'GET',
        path: '/Wx/Order/Page',
        handler: handlers.page,
        config: {
            description: '订单分页查询',
            tags: ['api',  'wx'],
            auth: {
                scope: [ 'wx']
            },
            validate: {
                query: Joi.object().keys({
                    status: Joi.string().allow(null).allow(''),
                    page: Joi.number().min(0).allow(null),
                    size: Joi.number().min(1).allow(null)
                }).label('/Wx/Order/Page')
            }
        }
    },
    {
        method: 'POST',
        path: '/Wx/Order/Create',
        handler: handlers.wxCreate,
        config: {
            description: '创建',
            tags: ['api', 'admin'],
            auth: {
              scope: "wx",
            },
            validate: {
                options: {
                  allowUnknown: true
                },
                payload: Joi.object().keys({
                    // address: Joi.object().keys({
                    //     _id: jois.CommonJoi.id,
                    //     province: Joi.string().required(),
                    //     city: Joi.string().required(),
                    //     county: Joi.string().required(),
                    //     areaValue: Joi.string().required(),
                    //     name: Joi.string().required(),
                    //     phone: Joi.string().required(),
                    //     address: Joi.string().required(),
                    // }),
                    commodityItems: Joi.array().items(Joi.object().keys({
                        count: Joi.number().required(),
                        commodity: Joi.object().keys({
                            _id: jois.CommonJoi.id,
                            name: Joi.string().required(),
                            photo: Joi.string().required(),
                        }),
                        sku: Joi.object().keys({
                            _id: jois.CommonJoi.id,
                            amount: Joi.number().required(),
                            code: Joi.string().required(),
                            commodityId: Joi.string().required(),
                            price: Joi.number().required(),
                            subdivide:  Joi.array().items(Joi.object().keys({
                                _id: jois.CommonJoi.id,
                                kind: Joi.string().required(),
                                value: Joi.string().required(),
                            }))
                        }),
                    }))
                }).label('/Wx/Order/Create')
            }
        }
    },
    {
        method: 'POST',
        path: '/Wx/Order/UpdateAddressAndDes',
        handler: handlers.wxUpdateAddressAndDes,
        config: {
            description: '修改地址和备注并且预支付',
            tags: ['api', 'admin'],
            auth: {
              scope: "wx",
            },
            validate: {
                options: {
                  allowUnknown: true
                },
                payload: Joi.object().keys({
                    id: jois.CommonJoi.id,
                    shippingFee: Joi.number().required(),
                    description: Joi.string().allow('').allow(null),
                    address: Joi.object().keys({
                        _id: jois.CommonJoi.id,
                        province: Joi.string().required(),
                        city: Joi.string().required(),
                        county: Joi.string().required(),
                        areaValue: Joi.string().required(),
                        name: Joi.string().required(),
                        phone: Joi.string().required(),
                        address: Joi.string().required(),
                    }),
                }).label('/Wx/Order/UpdateAddressAndDes')
            }
        }
    },
    {
        method: 'GET',
        path: '/Wx/Order/Get',
        handler: handlers.wxGet,
        config: {
            description: '查询单个',
            tags: ['api', 'admin'],
            auth: {
              scope: "wx",
            },
            validate: {
                query: Joi.object().keys({
                    id: jois.CommonJoi.id
                }).label('/Wx/Order/Get')
            }
        }
    },
    {
        method: 'GET',
        path: '/Wx/Order/CalculateShippingFee',
        handler: handlers.calculateShippingFee,
        config: {
            description: '计算快递费',
            tags: ['api', 'admin'],
            auth: {
              scope: "wx",
            },
            validate: {
                query: Joi.object().keys({
                    orderId: jois.CommonJoi.id,
                    areaValue: Joi.string().required(),
                }).label('/Wx/Order/CalculateShippingFee')
            }
        }
    }
];
