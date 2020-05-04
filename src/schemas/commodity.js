// https://mongoosejs.com/docs/schematypes.html
// https://mongoosejs.com/docs/validation.html
const Schema = require('mongoose').Schema;

const Commodity = new Schema({
    name: {//名称
        type: Schema.Types.String,
        trim: true,
        required: true
    },
    code: {//唯一编码
        type: Schema.Types.String,
        trim: true,
        required: true
    },
    categoryId: {//分类Id
        type: Schema.Types.String,
        trim: true,
        required: true
    },
    photos: {//照片
        type: [Schema.Types.String]
    },
    coverPhotos: {//封面图片
        type: [Schema.Types.String]
    },
    defaultPhoto: {//默认图片
        type: Schema.Types.String
    },
    brand: {//品牌
        type: Schema.Types.String,
        trim: true,
        required: true
    },
    description: {//详情
        type: Schema.Types.String
    },
    subdivide:
    [
        {
            kind: {type: Schema.Types.String},
            valueList: [Schema.Types.String]
        }
    ],
    details: //詳細信息。記錄型號重量規格等
    [
        {
            title: {type: Schema.Types.String},
            value: {type: Schema.Types.String}
        }
    ],
    archived: {
        type: Schema.Types.Boolean,
        default: false
    }
}, {timestamps: {}});

Commodity.index({code: 1});

module.exports = Commodity;
