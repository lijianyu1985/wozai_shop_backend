// hapi-swagger guide
// https://github.com/glennjones/hapi-swagger/blob/master/usageguide.md

// joi guide
// https://github.com/hapijs/joi/blob/v14.3.0/API.md
import handlers from '../handlers/admin';
import jois from '../utils/jois';
import Joi from '@hapi/joi';

export default [
    {
        method: 'POST',
        path: '/Admin/Signin',
        handler: handlers.signin,
        config: {
            description: '登录',
            tags: ['api', 'admin'],
            auth: false,
            validate: {
                payload: Joi.object().keys({
                    username: Joi.string().required().trim(),
                    password: jois.CommonJoi.password
                }).label('SigninModel')
            }
        }
    },
    {
        method: 'GET',
        path: '/Admin/CurrentUser',
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
        path: '/Admin/VerifyToken',
        handler: handlers.verifyToken,
        config: {
            description: 'Verify',
            tags: ['api','admin'],
            auth: false,
            validate: {
                payload: Joi.object().keys({
                    token: Joi.string().required()
                }).label('TokenModel')
            }
        }
    },
    {
        method: 'POST',
        path: '/Admin/DefaultPassword',
        handler: handlers.defaultPassword,
        config: {
            description: '重置默认密码',
            tags: ['api', 'admin'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object().keys({
                    id: jois.CommonJoi.id
                }).label('DefaultPasswordModel')
            }
        }
    },
    {
        method: 'POST',
        path: '/Admin/ResetPassword',
        handler: handlers.resetPassword,
        config: {
            description: '重置密码',
            tags: ['api', 'admin'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object().keys({
                    id: jois.CommonJoi.id,
                    password: jois.CommonJoi.password
                }).label('RestPasswordModel')
            }
        }
    },
    {
        method: 'POST',
        path: '/Admin/ChangePassword',
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
    },
    {
        method: 'POST',
        path: '/Admin/ChangeRole',
        handler: handlers.changeRole,
        config: {
            auth: {
                scope: ['admin']
            },
            description: '更新Admin角色',
            tags: ['api', 'admin'],
            validate: {
                payload: Joi.object().keys({
                    role: Joi.string().required(),
                    id: jois.CommonJoi.id
                }).label('ChangeRoleModel')
            }
        }
    },
    {
        method: 'POST',
        path: '/Admin/Archive',
        handler: handlers.archive,
        config: {
            auth: {
                scope: ['admin']
            },
            description: '归档账户',
            tags: ['api', 'admin'],
            validate: {
                payload: Joi.object().keys({
                    ids: Joi.array().items(jois.CommonJoi.id)
                }).label('ArchiveModel')
            }
        }
    },
    {
        method: 'POST',
        path: '/Admin/Unarchive',
        handler: handlers.unarchive,
        config: {
            auth: {
                scope: ['admin']
            },
            description: '归档还原',
            tags: ['api', 'admin'],
            validate: {
                payload: Joi.object().keys({
                    ids: Joi.array().items(jois.CommonJoi.id)
                }).label('UnarchiveModel')
            }
        }
    }
];
