import errors from '../utils/errors';
import {isJSON} from '../utils/utils';

async function all(request, h) {
    const {modelName, query, sort, selector} = request.query;
    const queryObject = isJSON(query) ? JSON.parse(query) : {};
    const sortObject = isJSON(sort) ? JSON.parse(sort) : {};
    queryObject.archived = {$in: [false, null, undefined]};
    const Model = request.mongo.models[modelName];
    const list = await Model.find(queryObject, selector).sort(sortObject);
    return {
        success: true,
        list
    };
}

async function pageQuery(request, h) {
    const {modelName, query, sort, selector, page = 1, size = 10} = request.query;
    const queryObject = isJSON(query) ? JSON.parse(query) : {};
    const sortObject = isJSON(sort) ? JSON.parse(sort) : {};
    queryObject.archived = {$in: [false, null, undefined]};
    const Model = request.mongo.models[modelName];
    const total = await Model.count(queryObject);
    const list = await Model.find(queryObject, selector).sort(sortObject).limit(size).skip((page - 1) * size);
    return {
        success: true,
        list,
        page,
        size,
        total
    };
}

async function find(request, h) {
    const {modelName, query, sort, selector} = request.query;
    const queryObject = isJSON(query) ? JSON.parse(query) : {};
    const sortObject = isJSON(sort) ? JSON.parse(sort) : {};
    queryObject.archived = {$in: [false, null, undefined]};
    const Model = request.mongo.models[modelName];
    const list = await Model.find(queryObject, selector).sort(sortObject);
    return {
        success: true,
        list
    };
}

async function get(request, h) {
    const {modelName, id, selector} = request.query;
    const Model = request.mongo.models[modelName];
    const data = await Model.findById(id, selector); ;
    return {
        success: true,
        data
    };
}

async function create(request, h) {
    const {modelName, data, opts} = request.payload;
    const Model = request.mongo.models[modelName];
    if(data.default && data.userId){
        await Model.updateMany({
            userId:data.userId
        }, {default:false});
    }
    const model = new Model(data);
    await model.save(opts);
    return {
        success: true,
        data: model
    };
}

async function update(request, h) {
    const {modelName, id, query, data, opts} = request.payload;
    const Model = request.mongo.models[modelName];
    if(data.default && data.userId){
        await Model.updateMany({
            userId:data.userId
        }, {default:false});
    }
    let model;
    if (id) {
        model = await Model.findByIdAndUpdate(id, data, opts || {new: true});
    }
    else if (query) {
        model = await Model.updateMany(query, data, opts || {new: true});
    }
    else {
        return {
            success: false,
            error: errors.common.updateQueryCantBeNull
        };
    }
    return {
        success: true,
        data: model
    };
}

async function remove(request, h) {
    const {modelName, ids, query} = request.payload;
    const Model = request.mongo.models[modelName];
    let model;
    if (ids && ids.length) {
        model = await Model.updateMany({_id: {$in: ids}}, {archived: true}, {new: true});
    }
    else if (query) {
        model = await Model.updateMany(query, {archived: true}, {new: true});
    }
    else {
        return {
            success: false,
            error: errors.common.updateQueryCantBeNull
        };
    }
    return {
        success: true,
        data: model
    };
}

export default {
    all,
    pageQuery,
    find,
    get,
    create,
    update,
    remove
};
