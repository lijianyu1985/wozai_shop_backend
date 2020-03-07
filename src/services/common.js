async function all(Model) {
    return await Model.find();
}
async function getById(Model, id, projection, opts) {
    if (!projection){
        return await Model.findById(id);
    }
    if (typeof projection === 'object' && !opts) {
        return await Model.findById(id, projection);
    };
    return await Model.findById(id, projection, opts);
}
async function getByQuery(Model, query, projection, opts) {
    if (!projection){
        return await Model.findOne(query);
    }
    if (typeof projection === 'object' && !opts) {
        return await Model.findOne(query, projection);
    };
    return await Model.findOne(query, projection, opts);
}
async function find(Model, query, projection, opts) {
    if (!projection){
        return await Model.find(query);
    }
    if (typeof projection === 'object' && !opts) {
        return await Model.find(query, projection);
    };
    return await Model.find(query, projection, opts);
}
async function removeById(Model, id, opts) {
    return await Model.findByIdAndRemove(id, opts);
}
async function removeByQuery(Model, query, opts) {
    return await Model.deleteMany(query, opts);
}
async function archive(Model, query, opts = {new:true}) {
    return await Model.updateMany(query, {archived: true}, opts);
}
async function unarchive(Model, query, opts = {new:true}) {
    return await Model.updateMany(query, {archived: false}, opts);
}
async function insert(Model, model, opts) {
    const m = new Model(model);
    await m.save(opts);
    return m;
}
async function updateByQuery(Model, query, update, opts = {new:true}) {
    return await Model.updateMany(query, update, opts);
}
async function updateById(Model, id, update, opts = {new:true}) {
    return await Model.findByIdAndUpdate(id, update, opts);
}

export default {
    all,
    getById,
    getByQuery,
    find,
    removeById,
    removeByQuery,
    archive,
    unarchive,
    insert,
    updateByQuery,
    updateById
};
