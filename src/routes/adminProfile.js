// hapi-swagger guide
// https://github.com/glennjones/hapi-swagger/blob/master/usageguide.md

// joi guide
// https://github.com/hapijs/joi/blob/v14.3.0/API.md
import handlers from '../handlers/admin';
import jois from '../utils/jois';
import Joi from '@hapi/joi';

export default [
    {
        method: 'GET',
        path: '/AdminProfile/CurrentUser',
        handler: handlers.currentUser,
        config: {
            description: '获取登录人信息',
            tags: ['api', 'admin'],
            auth: {
                scope: 'admin'
            }
        }
    },
    {
        method: 'POST',
        path: '/AdminProfile/ChangePassword',
        handler: handlers.changePassword,
        config: {
            description: '修改密码',
            tags: ['api', 'admin'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object().keys({
                    oldPassword: jois.CommonJoi.password,
                    newPassword: jois.CommonJoi.password
                }).label('ChangePasswordModel')
            }
        }
    }
];
