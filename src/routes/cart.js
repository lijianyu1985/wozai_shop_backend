// hapi-swagger guide
// https://github.com/glennjones/hapi-swagger/blob/master/usageguide.md

// joi guide
// https://github.com/hapijs/joi/blob/v14.3.0/API.md
import rbacPolicy from '../utils/auth/rbacPolicy';

export default [
    {
        method: 'GET',
        path: '/Admin/Find',
        handler: function (request, h) {
            return 'images';
        },
        config: {
            description: '查询',
            tags: ['api', 'admin'],
            auth: {
                scope: ['super_admin']
            },
            plugins: {
                rbac: rbacPolicy.admin
            }
        }
    },
    {
        method: 'POST',
        path: '/Admin/Create',
        handler: function (request, h) {
            return 'images';
        },
        config: {
            description: '创建',
            tags: ['api', 'admin']
        }
    },
    {
        method: 'POST',
        path: '/Admin/Update',
        handler: function (request, h) {
            return 'images';
        },
        config: {
            description: '更新',
            tags: ['api', 'admin']
        }
    },
    {
        method: 'DELETE',
        path: '/Admin/Delete',
        handler: function (request, h) {
            return 'images';
        },
        config: {
            description: '删除',
            tags: ['api', 'admin']
        }
    },
    {
        method: 'GET',
        path: '/Admin/Get',
        handler: function (request, h) {
            return 'images';
        },
        config: {
            description: '查询单个',
            tags: ['api', 'admin']
        }
    }
];
