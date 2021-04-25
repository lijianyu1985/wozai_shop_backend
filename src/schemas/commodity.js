// https://mongoosejs.com/docs/schematypes.html
// https://mongoosejs.com/docs/validation.html
const Schema = require("mongoose").Schema;
const commodityStatus = require("../utils/const").commodityStatus;
const commodityStatusMap = require("../utils/const").commodityStatusMap;

const Commodity = new Schema(
  {
    name: {
      //名称
      type: Schema.Types.String,
      trim: true,
      required: true,
    },
    code: {
      //唯一编码
      type: Schema.Types.String,
      trim: true,
      required: true,
    },
    categoryId: {
      //分类
      type: Schema.Types.ObjectId,
      ref: "category",
    },
    minPrice: {
        type: Schema.Types.Number,
        min: 0,
        default: 0
    },
    maxPrice: {
        type: Schema.Types.Number,
        min: 0,
        default: 0
    },
    priceRange: {
        type: Schema.Types.String,
    },
    photos: {
      //照片
      type: [Schema.Types.String],
    },
    coverPhotos: {
      //封面图片
      type: [Schema.Types.String],
    },
    defaultPhoto: {
      //默认图片
      type: Schema.Types.String,
    },
    brand: {
      //品牌
      type: Schema.Types.String,
      trim: true,
      required: true,
    },
    description: {
      //详情
      type: Schema.Types.String,
    },
    weight: {
      type: Schema.Types.Number,
    },
    status: {
      type: Schema.Types.String,
      default: commodityStatusMap.preOnline,
      enum: [...commodityStatus],
    },
    copyFrom: {
      type: Schema.Types.String,
    },
    defaultSubdivide: {
      type: Schema.Types.Boolean,
      default: false,
    },
    subdivide: [
      {
        kind: { type: Schema.Types.String },
        valueList: [Schema.Types.String],
      },
    ],
    //詳細信息。記錄型號重量規格等
    details: [
      {
        title: { type: Schema.Types.String },
        value: { type: Schema.Types.String },
      },
    ],
    archived: {
      type: Schema.Types.Boolean,
      default: false,
    },
    skus: [
      {
        type: Schema.Types.ObjectId,
        ref: "sku",
      },
    ],
  },
  { timestamps: {} }
);

Commodity.index({ code: 1 });

module.exports = Commodity;
