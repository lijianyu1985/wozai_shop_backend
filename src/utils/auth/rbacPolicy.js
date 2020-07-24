import lodash from 'lodash';
import Config from 'getconfig';

const policies = {
    super_admin:{
        resources:
        {
            adminmanagement: ['*'],
            adminprofile: ['*'],
            common: ['*'],
            product: ['page', 'find', 'get']
        },
        policy: {
            target: {'credentials:role': 'super_admin'},
            apply: 'permit-overrides',
            rules: [
                {
                    effect: 'permit'
                }
            ]
        }
    },
    admin:{
        resources:
        {
            adminprofile: ['*'],
            common: ['*'],
            product: ['page', 'find', 'get']
        },
        policy: {
            target: {'credentials:role': 'admin'},
            apply: 'permit-overrides',
            rules: [
                {
                    effect: 'permit'
                }
            ]
        }
    },
    product_admin:{
        resources:
        {
            adminprofile: ['*'],
            common: ['*'],
            product: ['*']
        },
        policy: {
            target: {'credentials:role': 'product_admin'},
            apply: 'permit-overrides',
            rules: [
                {
                    effect: 'permit'
                }
            ]
        }
    }
};

const denyPolicy = {
    policy: {
        target: {'credentials:scope': 'admin'},
        apply: 'deny-overrides',
        rules: [
            {
                effect: 'deny'
            }
        ]
    }
};

//method:path
function buildRouteKey(request) {
    //if common, replace common b y modelName
    const resourceKey = lodash.trim(request.route.path.toLowerCase(), ['/']);
    if (resourceKey.indexOf('common/') > 0) {
        const modelName = (request.query && request.query.modelName)
            || (request.payload && request.payload.modelName);
        return resourceKey.replace('common/', modelName);
    }
    return resourceKey;
}

export function policy(request) {
    if (!Config.authConfig.enabled) {
        return undefined;
    }
    if (!request.route.settings.auth) {
        return undefined;
    }
    const resourceKey = buildRouteKey(request);
    const modelAndPath = resourceKey.split('/');

    const targetPolicy = (policies[request.auth.credentials.role] && policies[request.auth.credentials.role].resources
        && (policies[request.auth.credentials.role].resources[modelAndPath[0]]
            && (policies[request.auth.credentials.role].resources[modelAndPath[0]].indexOf('*') >= 0
            || policies[request.auth.credentials.role].resources[modelAndPath[0]].indexOf(modelAndPath[1]) >= 0))
        ? policies[request.auth.credentials.role]
        : null) || denyPolicy;

    return {
        target: [{'credentials:scope': 'admin'}, {'credentials:scope': 'client'}],
        apply: 'permit-overrides',
        policies: [
            {
                target: [{'credentials:scope': 'client'}],
                apply: 'permit-overrides',
                rules: [
                    {
                        effect: 'permit'
                    }
                ]
            },
            {
                target: [{'credentials:scope': 'admin'}],
                apply: 'permit-overrides',
                policies: [
                    targetPolicy.policy
                ]
            }
        ]
    };

}
