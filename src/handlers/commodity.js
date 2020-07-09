
import {monthString, prefixInteger} from '../utils/utils';
import counterService from './../services/counter';
import commonSerivice from './../services/common';
import errors from '../utils/errors';
import lodash from 'lodash';
import {commodityStatusMap} from '../utils/const';

function buildSkus(subdivide) {
    if (subdivide && subdivide.length === 1) {
        return subdivide[0].valueList.map((val) => {
            return {
                [subdivide[0].kind]: val
            };
        });
    }
    else if (subdivide && subdivide.length > 1) {
        const current = buildSkus([subdivide[0]]);
        const next = buildSkus(subdivide.slice(1));
        const skus = [];
        if (current && current.length) {
            if (next && next.length) {
                current.forEach((cu) => {
                    next.forEach((ne) => {
                        skus.push(Object.assign({}, cu, ne));
                    });
                });
            }
            else {
                current.forEach((cu) => {
                    skus.push(Object.assign({}, cu));
                });
            }
        }
        else if (next && next.length) {
            next.forEach((ne) => {
                skus.push(Object.assign({}, ne));
            });
        }
        return skus;
    }
    return [];
}

async function createSkus(Sku, commodityId, code, subdivide) {
    const skus = buildSkus(subdivide);
    await Promise.all(skus.map(async (item) => {
        const kindList = lodash.keys(item);
        const skuSubdivide = [];
        kindList.forEach((kind) => {
            skuSubdivide.push({
                kind,
                value: item[kind]
            });
        });
        const sku = new Sku({
            commodityId,
            code,
            subdivide: skuSubdivide
        });
        await sku.save();
    }));
}

async function create(request, h) {
    const {name, code, brand, categoryId, photos, coverPhotos, description, subdivide} = request.payload;
    const Commodity = request.mongo.models.Commodity;
    const Sku = request.mongo.models.Sku;
    if (code) {
        const current = await commonSerivice.getByQuery(Commodity, {code, archived: false});
        if (current) {
            return {
                success: false,
                error: errors.commodity.codeAlreadyUsed
            };
        }
    }
    const fixedCode = code || ('COD' + monthString() + [prefixInteger(await counterService.getNextSeq(request.mongo.models.Counter, 'Commodity' + monthString()), 4)].join(''));
    const model = new Commodity({name, code: fixedCode, brand, categoryId, photos, coverPhotos, description, subdivide});
    await model.save();
    if (subdivide && subdivide.length) {
        await createSkus(Sku, model._id, fixedCode, subdivide);
    }
    return {
        success: true,
        data: model
    };
}

async function updateBasic(request, h) {
    const {id, name, brand, categoryId, photos, coverPhotos, description, subdivide} = request.payload;
    const Commodity = request.mongo.models.Commodity;
    const Sku = request.mongo.models.Sku;
    const current = await commonSerivice.getById(Commodity, id);
    if (!current) {
        return {
            success: false,
            error: errors.commodity.notExisting
        };
    }

    if (current.status !== commodityStatusMap.preOnline) {
        return {
            success: false,
            error: errors.commodity.statusNotAllowEditing
        };
    }

    const model = await Commodity.findByIdAndUpdate(id, {name, brand, categoryId, photos, coverPhotos, description, subdivide}, {new: true});

    // clear skus
    await Sku.deleteMany({
        commodityId: id
    });
    if (subdivide && subdivide.length) {
        await createSkus(Sku, id, model.code, subdivide);
    }
    return {
        success: true,
        data: model
    };
}

async function skuDetails(request, h) {
    const {id} = request.query;
    const Commodity = request.mongo.models.Commodity;
    const Sku = request.mongo.models.Sku;
    const commodity = await Commodity.findById(id, '_id name code subdivide status');
    const skus = await Sku.find({commodityId: id});
    return {
        success: true,
        data: {
            commodity,
            skus
        }
    };
}

async function updateSkus(request, h) {
    const {id, skus} = request.payload;
    const Commodity = request.mongo.models.Commodity;
    const Sku = request.mongo.models.Sku;
    const current = await commonSerivice.getById(Commodity, id);
    if (!current) {
        return {
            success: false,
            error: errors.commodity.notExisting
        };
    }

    if (current.status !== commodityStatusMap.preOnline) {
        return {
            success: false,
            error: errors.commodity.statusNotAllowEditing
        };
    }
    await Promise.all(skus.map(async (item) => {
        const currentSku = await Sku.findById(item._id);
        const update = {};
        if (item.amountVariation !== 0
            && item.amountVariation !== null
            && item.amountVariation !== undefined) {
            if (currentSku.amount + item.amountVariation >= 0) {
                update.$inc = {amount: item.amountVariation};
            }
            else {
                update.amount = 0;
            }
        }
        if (item.price >= 0) {
            update.price = item.price;
        }
        await Sku.findByIdAndUpdate(item._id, update);
    }));
    return {
        success: true
    };
}

async function publish(request, h) {
    const {id} = request.payload;
    const Commodity = request.mongo.models.Commodity;
    const current = await commonSerivice.getById(Commodity, id);
    if (!current) {
        return {
            success: false,
            error: errors.commodity.notExisting
        };
    }

    if (current.status !== commodityStatusMap.preOnline) {
        return {
            success: false,
            error: errors.commodity.statusNotAllowPublish
        };
    }

    await Commodity.findByIdAndUpdate(id, {status: '已上线'}, {new: true});
    return {
        success: true
    };
}

async function withdraw(request, h) {
    const {id} = request.payload;
    const Commodity = request.mongo.models.Commodity;
    const current = await commonSerivice.getById(Commodity, id);
    if (!current) {
        return {
            success: false,
            error: errors.commodity.notExisting
        };
    }

    if (current.status !== commodityStatusMap.online) {
        return {
            success: false,
            error: errors.commodity.statusNotAllowWithdraw
        };
    }
    await Commodity.findByIdAndUpdate(id, {status: '已下线'}, {new: true});
    return {
        success: true
    };
}

async function discard(request, h) {
    const {id} = request.payload;
    const Commodity = request.mongo.models.Commodity;
    const current = await commonSerivice.getById(Commodity, id);
    if (!current) {
        return {
            success: false,
            error: errors.commodity.notExisting
        };
    }

    if (current.status !== commodityStatusMap.preOnline) {
        return {
            success: false,
            error: errors.commodity.statusNotAllowDiscard
        };
    }
    await Commodity.findByIdAndUpdate(id, {status: '禁用'}, {new: true});
    return {
        success: true
    };
}

async function copy(request, h) {
    const {id} = request.payload;
    const Commodity = request.mongo.models.Commodity;
    const commodity = await Commodity.findById(id);

    const Sku = request.mongo.models.Sku;
    const code = ('COD' + monthString() + [prefixInteger(await counterService.getNextSeq(request.mongo.models.Counter, 'Commodity' + monthString()), 4)].join(''));
    const model = new Commodity({
        copyFrom: commodity._id,
        name: commodity.name,
        code,
        brand: commodity.brand,
        categoryId: commodity.categoryId,
        photos: commodity.photos,
        coverPhotos: commodity.coverPhotos,
        description: commodity.description,
        subdivide: commodity.subdivide
    });
    await model.save();
    if (commodity.subdivide && commodity.subdivide.length) {
        await createSkus(Sku, model._id, code, commodity.subdivide);
    }
    return {
        success: true,
        data: model
    };
}

async function details(request, h) {
    const {id} = request.query;
    const Commodity = request.mongo.models.Commodity;
    const commodity = await Commodity.findById(id);
    return {
        success: true,
        data: commodity
    };
}

async function wxDetails(request, h) {
    const {id} = request.query;
    const Commodity = request.mongo.models.Commodity;
    const Sku = request.mongo.models.Sku;
    const commodity = await Commodity.findById(id);
    const skus = await Sku.find({commodityId: id});
    const maxPrice = lodash.maxBy(skus, (s) => {
        return s.price;
    }).price;
    const minPrice = lodash.minBy(skus, (s) => {
        return s.price;
    }).price;
    const priceRange = minPrice === maxPrice ? maxPrice : minPrice + ' - ' + maxPrice;
    return {
        success: true,
        commodity,
        skus,
        priceRange
    };
}

async function categoriesAndFirstCategoryCommodities(request, h) {
    const Category = request.mongo.models.Category;
    const Commodity = request.mongo.models.Commodity;
    const categories = await Category.find({archived: false}, '_id name');
    const commodities = await Commodity.find({categoryId: categories.length && categories[0]._id, archived: false}, '_id name coverPhotos');
    return {
        success: true,
        categories: (categories || []).map((x) => ({
            id: x._id,
            name: x.name
        })),
        commodities: (commodities || []).map((x) => ({
            id: x._id,
            name: x.name,
            photo: x.coverPhotos && x.coverPhotos.length && x.coverPhotos[0]
        }))
    };
}

async function commoditiesByCategory(request, h) {
    const {categoryId} = request.query;
    const Commodity = request.mongo.models.Commodity;
    const commodities = await Commodity.find({categoryId, archived: false}, '_id name coverPhotos');
    return {
        success: true,
        commodities: (commodities || []).map((x) => ({
            id: x._id,
            name: x.name,
            photo: x.coverPhotos && x.coverPhotos.length && x.coverPhotos[0]
        }))
    };
}

export default {
    create,
    updateBasic,
    skuDetails,
    updateSkus,
    publish,
    withdraw,
    discard,
    copy,
    details,
    wxDetails,
    categoriesAndFirstCategoryCommodities,
    commoditiesByCategory
};
