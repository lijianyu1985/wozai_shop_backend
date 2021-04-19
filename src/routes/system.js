import handlers from '../handlers/system';

export default [
    {
        method: 'GET',
        path: '/System/MerchantAddress',
        handler: handlers.getMerchantAddress,
        config: {
            description: '查询店铺地址',
            tags: ['api', 'system'],
            auth: {
                scope: ['admin']
            }
        }
    }
];
