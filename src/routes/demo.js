// hapi-swagger guide
// https://github.com/glennjones/hapi-swagger/blob/master/usageguide.md

// joi guide
// https://github.com/hapijs/joi/blob/v14.3.0/API.md
import rbacPolicy from '../utils/auth/rbacPolicy';

export default [
    {
        method: 'GET',
        path: '/Material/FindAll',
        handler: function (request, h) {
            return 'images';
        },
        config: {
            description: '查询所有Material数据',
            tags: ['api', 'material'],
            auth: {
                scope: ['admin']
            },
            plugins: {
                rbac: rbacPolicy.admin
            }
        }
    },
    {
        method: 'GET',
        path: '/Material/PageMaterials',
        handler: function (request, h) {
            return 'images';
        },
        config: {

            description: '查询所有Material数据',
            tags: ['api', 'material']
        }
    },
    {
        method: 'POST',
        path: '/Material/Create',
        handler: function (request, h) {
            return 'images';
        },
        config: {
            description: '创建新的Material',
            tags: ['api', 'material']
        }
    },
    {
        method: 'POST',
        path: '/Material/Change',
        handler: function (request, h) {
            return 'images';
        },
        config: {
            description: '更新Material',
            notes: ['Url必须包含id'],
            tags: ['api', 'material']
        }
    },
    {
        method: 'GET',
        path: '/Material/Get',
        handler: function (request, h) {
            return 'images';
        },
        config: {
            description: '查询Material详情',
            notes: ['Url必须包含id'],
            tags: ['api', 'material']
        }
    },
    {
        method: 'POST',
        path: '/Material/Archive',
        handler: function (request, h) {
            return 'images';
        },
        config: {

            description: '归档Material',
            notes: [],
            tags: ['api', 'material']
        }
    },
    {
        method: 'POST',
        path: '/Material/Unarchive',
        handler: function (request, h) {
            return 'images';
        },
        config: {
            description: '归档还原',
            notes: [],
            tags: ['api', 'material']
        }
    },
    {
        method: 'GET',
        path: '/Material/FindByName',
        handler: function (request, h) {
            return 'images';
        },
        config: {
            description: '查询Material数据',
            tags: ['api', 'material']
        }
    },
    {
        method: 'GET',
        path: '/Material/FindByCode',
        handler: function (request, h) {
            return 'images';
        },
        config: {
            description: '查询Material数据',
            tags: ['api', 'material']
        }
    },
    {
        method: 'GET',
        path: '/Material/FindByNameOrCode',
        handler: function (request, h) {
            return 'images';
        },
        config: {
            description: '查询Material数据',
            tags: ['api', 'material']
        }
    },
    {
        method: 'POST',
        path: '/Material/AttachToProduct',
        handler: function (request, h) {
            return 'images';
        },
        config: {
            description: '关联到Product',
            notes: [],
            tags: ['api', 'material']
        }
    },
    {
        method: 'POST',
        path: '/Material/AttachMaterialsToProducts',
        handler: function (request, h) {
            return 'images';
        },
        config: {
            description: '关联到Product',
            notes: [],
            tags: ['api', 'material']
        }
    },
    {
        method: 'POST',
        path: '/Material/ImportMaterials',
        handler: function (request, h) {
            return 'images';
        },
        config: {
            description: '导入产品',
            notes: [],
            tags: ['api', 'material']
        }
    }
];
