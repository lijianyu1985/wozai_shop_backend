// https://mongoosejs.com/docs/schematypes.html
// https://mongoosejs.com/docs/validation.html
const Schema = require('mongoose').Schema;

const Product = new Schema({
    skuId: {
        type: Schema.Types.String,
        trim: true,
        required: true
    },
    price: {
        type: Schema.Types.Number,
        trim: true,
        required: true
    },
    subdivide:
    [
        {
            kindValueList: [
                {
                    kind: {type: Schema.Types.String},
                    value: {type: Schema.Types.String}
                }
            ],
            amount: {type: Schema.Types.String}
        }
    ],
    archived: {
        type: Schema.Types.Boolean,
        default: false
    }
}, {timestamps: {}});

Product.index({code: 1});

module.exports = Product;
