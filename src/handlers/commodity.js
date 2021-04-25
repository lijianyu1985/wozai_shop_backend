import { monthString, prefixInteger } from "../utils/utils";
import counterService from "./../services/counter";
import commonSerivice from "./../services/common";
import errors from "../utils/errors";
import lodash from "lodash";
import { commodityStatusMap } from "../utils/const";

function buildSkus(subdivide) {
  if (subdivide && subdivide.length === 1) {
    return subdivide[0].valueList.map((val) => {
      return {
        [subdivide[0].kind]: val,
      };
    });
  } else if (subdivide && subdivide.length > 1) {
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
      } else {
        current.forEach((cu) => {
          skus.push(Object.assign({}, cu));
        });
      }
    } else if (next && next.length) {
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
  const skuIds = [];
  await Promise.all(
    skus.map(async (item) => {
      const kindList = lodash.keys(item);
      const skuSubdivide = [];
      kindList.forEach((kind) => {
        skuSubdivide.push({
          kind,
          value: item[kind],
        });
      });
      const sku = new Sku({
        commodityId,
        code,
        subdivide: skuSubdivide,
      });
      await sku.save();
      skuIds.push(sku._id);
    })
  );
  return skuIds;
}

function subdividesInSubdivides(subdivide, subdivides) {
  return subdivides.some(
    (x) => x.kind === subdivide.kind && x.value === subdivide.value
  );
}

function compareSubdivides(subdividesA, subdividesB) {
  return (
    subdividesA.every((x) => subdividesInSubdivides(x, subdividesB)) &&
    subdividesB.every((x) => subdividesInSubdivides(x, subdividesA))
  );
}

function itemToSubdivide(item) {
  const kindList = lodash.keys(item);
  const skuSubdivide = [];
  kindList.forEach((kind) => {
    skuSubdivide.push({
      kind,
      value: item[kind],
    });
  });
  return skuSubdivide;
}

//插入或者删除
async function updateSkusForCommodity(Sku, commodityId, code, subdivide) {
  const currentSkus = await Sku.find({ commodityId });
  const skus = buildSkus(subdivide);
  const skuIds = [];
  //删除找不到的skus
  const oldSkusNotFound = currentSkus.filter((x) => {
    return !skus.some((y) =>
      compareSubdivides(itemToSubdivide(y), x.subdivide)
    );
  });
  await Sku.deleteMany({
    commodityId,
    _id: { $in: oldSkusNotFound.map((x) => x._id) },
  });
  //插入不存在的skus
  const newSkusNotFound = skus.filter(
    (x) =>
      !currentSkus.some((y) =>
        compareSubdivides(itemToSubdivide(x), y.subdivide)
      )
  );
  await Promise.all(
    newSkusNotFound.map(async (item) => {
      const skuSubdivide = itemToSubdivide(item);
      const sku = new Sku({
        commodityId,
        code,
        subdivide: skuSubdivide,
      });
      await sku.save();
      skuIds.push(sku._id);
    })
  );
  const currentExistingSkus = await Sku.find({ commodityId }, "_id");
  return currentExistingSkus.map((x) => x._id);
}

async function create(request, h) {
  const {
    name,
    code,
    brand,
    weight,
    categoryId,
    photos,
    coverPhotos,
    description,
    subdivide,
    defaultSubdivide,
  } = request.payload;
  const Commodity = request.mongo.models.Commodity;
  const Sku = request.mongo.models.Sku;
  if (code) {
    const current = await commonSerivice.getByQuery(Commodity, {
      code,
      archived: false,
    });
    if (current) {
      return {
        success: false,
        error: errors.commodity.codeAlreadyUsed,
      };
    }
  }
  const fixedCode =
    code ||
    "COD" +
      monthString() +
      [
        prefixInteger(
          await counterService.getNextSeq(
            request.mongo.models.Counter,
            "Commodity" + monthString()
          ),
          4
        ),
      ].join("");
  const model = new Commodity({
    name,
    code: fixedCode,
    brand,
    weight,
    categoryId,
    photos,
    coverPhotos,
    description,
    subdivide,
    defaultSubdivide,
    price: 0,
  });
  await model.save();
  if (subdivide && subdivide.length) {
    const skus = await createSkus(Sku, model._id, fixedCode, subdivide);
    await Commodity.findByIdAndUpdate(
      model._id,
      { skus, price },
      { new: true }
    );
  }
  return {
    success: true,
    data: model,
  };
}

async function updateBasic(request, h) {
  const {
    id,
    name,
    brand,
    weight,
    categoryId,
    photos,
    coverPhotos,
    description,
    subdivide,
    defaultSubdivide,
  } = request.payload;
  const Commodity = request.mongo.models.Commodity;
  const Sku = request.mongo.models.Sku;
  const current = await commonSerivice.getById(Commodity, id);
  if (!current) {
    return {
      success: false,
      error: errors.commodity.notExisting,
    };
  }

  if (current.status !== commodityStatusMap.preOnline) {
    return {
      success: false,
      error: errors.commodity.statusNotAllowEditing,
    };
  }

  const model = await Commodity.findByIdAndUpdate(
    id,
    {
      name,
      brand,
      weight,
      categoryId,
      photos,
      coverPhotos,
      description,
      subdivide,
      defaultSubdivide,
    },
    { new: true }
  );

  if (subdivide && subdivide.length) {
    //TODO: update skus
    const skus = await updateSkusForCommodity(
      Sku,
      model._id,
      model.code,
      subdivide
    );
    await Commodity.findByIdAndUpdate(id, { skus }, { new: true });
  }
  return {
    success: true,
    data: model,
  };
}

async function skuDetails(request, h) {
  const { id } = request.query;
  const Commodity = request.mongo.models.Commodity;
  const Sku = request.mongo.models.Sku;
  const commodity = await Commodity.findById(
    id,
    "_id name code subdivide status archived defaultSubdivide"
  );
  const skus = await Sku.find({ commodityId: id });
  return {
    success: true,
    data: {
      commodity,
      skus,
    },
  };
}

async function updateSkus(request, h) {
  const { id, skus } = request.payload;
  const Commodity = request.mongo.models.Commodity;
  const Sku = request.mongo.models.Sku;
  const current = await commonSerivice.getById(Commodity, id);
  if (!current) {
    return {
      success: false,
      error: errors.commodity.notExisting,
    };
  }

  if (current.status !== commodityStatusMap.preOnline) {
    return {
      success: false,
      error: errors.commodity.statusNotAllowEditing,
    };
  }
  if (skus && skus.length) {
    await Promise.all(
      skus.map(async (item) => {
        const currentSku = await Sku.findById(item._id);
        const update = { archived: item.archived };
        if (
          item.amountVariation !== 0 &&
          item.amountVariation !== null &&
          item.amountVariation !== undefined
        ) {
          if (currentSku.amount + item.amountVariation >= 0) {
            update.$inc = { amount: item.amountVariation };
          } else {
            update.amount = 0;
          }
        }
        if (item.price >= 0) {
          update.price = item.price;
        }
        await Sku.findByIdAndUpdate(item._id, update);
      })
    );
  }

  const existingSkus = await commonSerivice.find(Sku, { commodityId: id });
  const maxPrice = lodash.maxBy(existingSkus, (s) => {
    return s.price;
  }).price;
  const minPrice = lodash.minBy(existingSkus, (s) => {
    return s.price;
  }).price;
  const priceRange =
    minPrice === maxPrice ? maxPrice + "" : minPrice + " - " + maxPrice;

  await commonSerivice.updateById(Commodity, id, {
    priceRange,
    minPrice,
    maxPrice,
  });

  return {
    success: true,
  };
}

async function publish(request, h) {
  const { id } = request.payload;
  const Commodity = request.mongo.models.Commodity;
  const current = await commonSerivice.getById(Commodity, id);
  if (!current) {
    return {
      success: false,
      error: errors.commodity.notExisting,
    };
  }

  if (current.status !== commodityStatusMap.preOnline) {
    return {
      success: false,
      error: errors.commodity.statusNotAllowPublish,
    };
  }

  await Commodity.findByIdAndUpdate(id, { status: "已上线" }, { new: true });
  return {
    success: true,
  };
}

async function withdraw(request, h) {
  const { id } = request.payload;
  const Commodity = request.mongo.models.Commodity;
  const current = await commonSerivice.getById(Commodity, id);
  if (!current) {
    return {
      success: false,
      error: errors.commodity.notExisting,
    };
  }

  if (current.status !== commodityStatusMap.online) {
    return {
      success: false,
      error: errors.commodity.statusNotAllowWithdraw,
    };
  }
  await Commodity.findByIdAndUpdate(id, { status: "已下线" }, { new: true });
  return {
    success: true,
  };
}

async function discard(request, h) {
  const { id } = request.payload;
  const Commodity = request.mongo.models.Commodity;
  const current = await commonSerivice.getById(Commodity, id);
  if (!current) {
    return {
      success: false,
      error: errors.commodity.notExisting,
    };
  }

  if (current.status !== commodityStatusMap.preOnline) {
    return {
      success: false,
      error: errors.commodity.statusNotAllowDiscard,
    };
  }
  await Commodity.findByIdAndUpdate(id, { status: "禁用" }, { new: true });
  return {
    success: true,
  };
}

async function copy(request, h) {
  const { id } = request.payload;
  const Commodity = request.mongo.models.Commodity;
  const commodity = await Commodity.findById(id);

  const Sku = request.mongo.models.Sku;
  const code =
    "COD" +
    monthString() +
    [
      prefixInteger(
        await counterService.getNextSeq(
          request.mongo.models.Counter,
          "Commodity" + monthString()
        ),
        4
      ),
    ].join("");
  const model = new Commodity({
    copyFrom: commodity._id,
    name: commodity.name,
    code,
    brand: commodity.brand,
    weight: commodity.weight,
    categoryId: commodity.categoryId,
    photos: commodity.photos,
    coverPhotos: commodity.coverPhotos,
    description: commodity.description,
    defaultSubdivide: commodity.defaultSubdivide,
    subdivide: commodity.subdivide,
  });
  await model.save();
  if (commodity.subdivide && commodity.subdivide.length) {
    await createSkus(Sku, model._id, code, commodity.subdivide);
  }
  return {
    success: true,
    data: model,
  };
}

async function details(request, h) {
  const { id } = request.query;
  const Commodity = request.mongo.models.Commodity;
  const commodity = await Commodity.findById(id);
  return {
    success: true,
    data: commodity,
  };
}

async function wxDetails(request, h) {
  const { id } = request.query;
  const Commodity = request.mongo.models.Commodity;
  const Sku = request.mongo.models.Sku;
  const commodity = await Commodity.findById(id).populate("skus");
  const skus = await Sku.find({ commodityId: id });
  return {
    success: true,
    commodity: {
      id: commodity._id,
      name: commodity.name,
      photo:
        commodity.coverPhotos &&
        commodity.coverPhotos.length &&
        commodity.coverPhotos[0],
      coverPhotos: commodity.coverPhotos,
      photos: commodity.photos,
      subdivide: commodity.subdivide,
      defaultSubdivide: commodity.defaultSubdivide,
      skus: filterSkus(commodity.skus),
      priceRange: commodity.priceRange,
      weight: commodity.weight,
      description: commodity.description,
    },
    skus,
    priceRange: commodity.priceRange,
  };
}

async function wxMain(request, h) {
  const Banner = request.mongo.models.Banner;
  const banners = await Banner.find();
  return {
    success: true,
    banners,
  };
}

async function categoriesAndFirstCategoryCommodities(request, h) {
  const Category = request.mongo.models.Category;
  const Commodity = request.mongo.models.Commodity;
  const categories = await Category.find({ archived: false }, "_id name");
  const commodities = await Commodity.find(
    { categoryId: categories.length && categories[0]._id, archived: false },
    "_id name coverPhotos"
  );
  return {
    success: true,
    categories: (categories || []).map((x) => ({
      id: x._id,
      name: x.name,
    })),
    commodities: (commodities || []).map((x) => ({
      id: x._id,
      name: x.name,
      photo: x.coverPhotos && x.coverPhotos.length && x.coverPhotos[0],
    })),
  };
}

const getPriceRange = (skus) => {
  if (!skus || !skus.length) {
    return "0";
  }
  const maxPrice = lodash.maxBy(skus, (s) => {
    return s.price;
  }).price;
  const minPrice = lodash.minBy(skus, (s) => {
    return s.price;
  }).price;
  return minPrice === maxPrice ? maxPrice : minPrice + " - " + maxPrice;
};
const filterSkus = (skus) => {
  return skus.filter((x) => x.amount > 0);
};

async function commoditiesByCategory(request, h) {
  const { categoryId } = request.query;
  const Commodity = request.mongo.models.Commodity;
  const commodities = await Commodity.find(
    { categoryId: categoryId.toObjectId(), archived: false }, // status: "已上线" },
    "_id name weight coverPhotos subdivide skus defaultSubdivide priceRange"
  ).populate("skus");

  return {
    success: true,
    commodities: (commodities || []).map((x) => ({
      id: x._id,
      name: x.name,
      photo: x.coverPhotos && x.coverPhotos.length && x.coverPhotos[0],
      subdivide: x.subdivide,
      defaultSubdivide: x.defaultSubdivide,
      skus: filterSkus(x.skus),
      priceRange: x.priceRange,
      weight: x.weight,
    })),
  };
}

async function search(request, h) {
  const { searchTerm, sortBy, order, page = 1, size = 10 } = request.query;
  //TODO: support other sort fileds
  const sortField = "maxPrice"; //sortBy === 'price'?'maxPrice': 'maxPrice';
  const Commodity = request.mongo.models.Commodity;
  const query = {
    $or: [
      { name: { $regex: searchTerm, $options: "$i" } },
      { description: { $regex: searchTerm, $options: "$i" } },
      { code: searchTerm },
      { brand: searchTerm },
      { details: { $elemMatch: { value: searchTerm } } },
      { subdivide: { $elemMatch: { valueList: searchTerm } } },
      { "category.name": searchTerm },
    ],
    archived: false, // status: "已上线"
  };

  const count = await Commodity.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $match: query,
    },
    {
      $count: "total",
    },
  ]);
  const commodities = await Commodity.aggregate([
    {
      $lookup: {
        from: "skus",
        localField: "skus",
        foreignField: "_id",
        as: "skus",
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $sort: { [sortField]: order } },
    {
      $unwind: "$category",
    },
    {
      $project: {
        _id: 1,
        name: 1,
        weight: 1,
        coverPhotos: 1,
        subdivide: 1,
        skus: 1,
        defaultSubdivide: 1,
        archived: 1,
        priceRange: 1,
        category: {
          _id: 1,
          name: 1,
        },
      },
    },
    {
      $match: query,
    },
    {
      $skip:(page - 1) * size
    },
    {
      $limit:size
    }
  ]);
  
  return {
    success: true,
    commodities: (commodities || []).map((x) => ({
      id: x._id,
      name: x.name,
      photo: x.coverPhotos && x.coverPhotos.length && x.coverPhotos[0],
      subdivide: x.subdivide,
      defaultSubdivide: x.defaultSubdivide,
      skus: filterSkus(x.skus),
      priceRange: x.priceRange,
      weight: x.weight,
    })),
    page,
    size,
    total: count[0].total,
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
  wxMain,
  categoriesAndFirstCategoryCommodities,
  commoditiesByCategory,
  search,
};
