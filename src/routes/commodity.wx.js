// hapi-swagger guide
// https://github.com/glennjones/hapi-swagger/blob/master/usageguide.md

// joi guide
// https://github.com/hapijs/joi/blob/v14.3.0/API.md
import handlers from '../handlers/commodity';
import jois from '../utils/jois';
import Joi from '@hapi/joi';

export default [
    {
        method: 'GET',
        path: '/Wx/Commodity/Details',
        handler: handlers.wxDetails,
        config: {
            description: '详情微信',
            tags: ['api', 'commodity'],
            auth: false,
            validate: {
                query: Joi.object().keys({
                    id: jois.CommonJoi.id
                }).label('WxDetails')
            }
        }
    },
    {
        method: 'GET',
        path: '/Wx/Commodity/CategoriesAndFirstCategoryCommodities',
        handler: handlers.categoriesAndFirstCategoryCommodities,
        config: {
            description: '产品分类和第一页产品',
            tags: ['api', 'commodity'],
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/Wx/Commodity/CommoditiesByCategory',
        handler: handlers.commoditiesByCategory,
        config: {
            description: '根据分类查询产品',
            tags: ['api', 'commodity'],
            auth: false,
            validate: {
                query: Joi.object().keys({
                    categoryId: jois.CommonJoi.id
                }).label('CommoditiesByCategory')
            }
        }
    }
];
