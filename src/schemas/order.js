// https://mongoosejs.com/docs/schematypes.html
// https://mongoosejs.com/docs/validation.html

const Schema = require('mongoose').Schema;
const orderStatus = require("../utils/const").orderStatus;
const orderStatusMap = require("../utils/const").orderStatusMap;

const CommodityItem = new Schema({
    commodity:{
        type: Schema.Types.Mixed,
    },
    sku:{
        type: Schema.Types.Mixed,
    },
    count:{
        type: Schema.Types.Number,
        min: 1
    }
});

const Order = new Schema({
    orderNumber: {//订单号
        type: Schema.Types.String,
        trim: true,
        required: true
    },
    address:{
        type: Schema.Types.Mixed,
    },
    userId: {
        type: Schema.Types.String
    },
    touchedTime: {
        type: Schema.Types.Date,
        default: Date.now(),
    },
    commodityItems:[CommodityItem],
    rate:{
        commodityCost: {
            type: Schema.Types.Number,
            required: true,
            min: 0
        },
        shippingFee: {
            type: Schema.Types.Number,
            trim: true
        },
        discount: {
            type: Schema.Types.Number,
            default:0,
            min: 0
        },
        total: {
            type: Schema.Types.Number,
        }
    },
    status: {
      type: Schema.Types.String,
      default: orderStatusMap.Created,
      enum: [...orderStatus],
    },
    statusHistory: {
        type: Schema.Types.String
    },
    description: {
        type: Schema.Types.String
    },
    archived: {
        type: Schema.Types.Boolean,
        default: false
    }
}, {timestamps: {}});

Order.index({orderNumber: 1});

module.exports = Order;
