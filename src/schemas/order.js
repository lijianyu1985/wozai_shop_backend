// https://mongoosejs.com/docs/schematypes.html
// https://mongoosejs.com/docs/validation.html

const Schema = require('mongoose').Schema;

const ProductItem = new Schema({
    amount:{
        type: Schema.Types.Number,
        min: 1
    },
    rate: {
        price: {
            type: Schema.Types.Number,
            min: 0
        },
        discount: {
            type: Schema.Types.Number,
            min: 0
        }
    }
});

const Order = new Schema({
    orderNumber: {//订单号
        type: Schema.Types.String,
        trim: true,
        required: true
    },
    clientId: {
        type: Schema.Types.Mixed
    },
    productItems:[ProductItem],
    rate:{
        productCost: {
            type: Schema.Types.Number,
            required: true,
            min: 0
        },
        payer: {
            type: Schema.Types.String,
            trim: true
        }
    },
    status: {
        type: Schema.Types.String
    },
    statusHistory: {
        type: Schema.Types.String
    },
    isRefunded: {
        type: Schema.Types.Boolean,
        default: false
    },
    isApplingRefunded: {
        type: Schema.Types.Boolean,
        default: false
    },
    couponId: {
        type: Schema.Types.String
    },
    couponOff: {
        type: Schema.Types.Number
    },
    description: {
        type: Schema.Types.String
    }
}, {timestamps: {}});

Order.index({orderNumber: 1});

module.exports = Order;
