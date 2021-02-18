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
        path: '/Wx/Main/GetBanners',
        handler: handlers.wxMain,
        config: {
            description: '详情微信',
            tags: ['api', 'main'],
            auth: false,
        }
    },
];
