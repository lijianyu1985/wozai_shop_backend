import errors from '../utils/errors';
import {isJSON} from '../utils/utils';

async function pageQuery(request, h) {
    const {modelName, query, sort, selector, page = 1, size = 10} = request.query;
    const queryObject = isJSON(query) ? JSON.parse(query) : {};
    const sortObject = isJSON(sort) ? JSON.parse(sort) : {};
    queryObject.archived = false;
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
    queryObject.archived = false;
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
    const dataObject = isJSON(data) ? JSON.parse(data) : {};
    const optsObject = isJSON(opts) ? JSON.parse(opts) : {};
    const Model = request.mongo.models[modelName];
    const model = new Model(dataObject);
    await model.save(optsObject);
    return {
        success: true,
        data: model
    };
}

async function update(request, h) {
    const {modelName, id, query, data, opts} = request.payload;
    const Model = request.mongo.models[modelName];
    const dataObject = isJSON(data) ? JSON.parse(data) : {};
    const optsObject = isJSON(opts) ? JSON.parse(opts) : {};
    let model;
    if (id) {
        model = await Model.findByIdAndUpdate(id, dataObject, optsObject || {new: true});
    }
    else if (query) {
        model = await Model.updateMany(query, dataObject, optsObject || {new: true});
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
    const {modelName, id, query} = request.payload;
    const Model = request.mongo.models[modelName];
    let model;
    if (id) {
        model = await Model.findByIdAndUpdate(id, {archived: true}, {new: true});
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
    pageQuery,
    find,
    get,
    create,
    update,
    remove
};
