// https://mongoosejs.com/docs/schematypes.html
// https://mongoosejs.com/docs/validation.html
const Schema = require('mongoose').Schema;

const Sku = new Schema({
    commodityId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'commodity'
    },
    code: {
        type: Schema.Types.String,
        trim: true,
        required: true
    },
    price: {
        type: Schema.Types.Number,
        min: 0,
        default: 0
    },
    amount: {
        type: Schema.Types.Number,
        min: 0,
        default: 0
    },
    subdivide:
        [
            {
                kind: {type: Schema.Types.String},
                value: {type: Schema.Types.String}
            }
        ],
    archived: {
        type: Schema.Types.Boolean,
        default: false
    }
}, {timestamps: {}});

Sku.index({code: 1});

module.exports = Sku;
