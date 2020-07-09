import errors from '../../utils/errors';

export default {
    '/common/delete': async (request) => {
        const {payload, query} = request;
        const params = Object.assign({}, payload, query);
        if (params.modelName === 'Category') {
            const Commodity = request.mongo.models.Commodity;
            if (request.method === 'delete') {
                const categories = params.ids || [];
                const commodities = await Commodity.find({categoryId: {$in: categories}, archived: false}, '_id');
                if (commodities.length) {
                    return {
                        error: errors.category.cantDeleteWhenHasReference
                    };
                }
            }
        }
        return null;
    }
};
