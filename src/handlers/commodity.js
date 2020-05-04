
import {monthString, prefixInteger} from '../utils/utils';
import counterService from './../services/counter';
import commonSerivice from './../services/common';
import errors from '../utils/errors';
import lodash from 'lodash';

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
    const commodity = await Commodity.findById(id, '_id name code subdivide');
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
    const {skus} = request.payload;
    const Sku = request.mongo.models.Sku;
    await Promise.all(skus.map(async (item) => {
        const currentSku = await Sku.findById(item._id);
        const update = {};
        if (item.amountVariation !== 0
            && item.amountVariation !== null
            && item.amountVariation !== undefined) {
            if (currentSku.amount + item.amountVariation >= 0){
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

export default {
    create,
    updateBasic,
    skuDetails,
    updateSkus
};
