// https://mongoosejs.com/docs/schematypes.html
// https://mongoosejs.com/docs/validation.html

const Schema = require('mongoose').Schema;
const orderStatus = require('../utils/const').orderStatus;
const shippingStatus = require('../utils/const').shippingStatus;
const shippingStatusMap = require('../utils/const').shippingStatusMap;
const orderStatusMap = require('../utils/const').orderStatusMap;

const Operator = new Schema({
    id:{
        type: Schema.Types.String
    },
    name:{
        type: Schema.Types.String
    }
});

const OrderStatus = new Schema({
    name: {
        type: Schema.Types.String,
        default: orderStatusMap.Created,
        enum: [...orderStatus]
    },
    comment: {
        type: Schema.Types.String,
        default: ''
    },
    operatorType: {
        type: Schema.Types.String,
        required: true,
        default: '',
        enum: ['client', 'admin', 'staff', 'system']
    },
    operator: {
        type: Operator
    },
    operateAt: {
        type: Schema.Types.Date,
        default: Date.now
    }
});

const CommodityItem = new Schema({
    commodity:{
        type: Schema.Types.Mixed
    },
    sku:{
        type: Schema.Types.Mixed
    },
    count:{
        type: Schema.Types.Number,
        min: 1
    }
});

const ShippingStatus = new Schema({
    status:{
        type: Schema.Types.String,
        default: shippingStatusMap.Created
    },
    context:{
        type: Schema.Types.String
    },
    time:{
        type: Schema.Types.Date
    },
    ftime:{
        type: Schema.Types.Date
    },
    areaCode:{
        type: Schema.Types.String
    },
    areaName:{
        type: Schema.Types.String
    }
});



const Shipping = new Schema({
    status:{
        type: ShippingStatus
    },
    number:{
        type: Schema.Types.String
    },
    company:{
        type: Schema.Types.String
    },
    sender:{
        type: Schema.Types.Mixed
    },
    receiver:{
        type: Schema.Types.Mixed
    },
    count:{
        type: Schema.Types.Number
    },
    weight:{
        type: Schema.Types.Number
    },
    timestamp: {
        type: Schema.Types.Date,
        default: Date.now()
    },
    creator: {
        type: Operator
    },
    statusHistory:[ShippingStatus],
    printImagePath: {
        type: Schema.Types.String
    }
});

const Order = new Schema({
    orderNumber: {//订单号
        type: Schema.Types.String,
        trim: true,
        required: true
    },
    address:{
        type: Schema.Types.Mixed
    },
    userId: {
        type: Schema.Types.String
    },
    paidTimestamp: {
        type: Schema.Types.Date
    },
    touchedTimestamp: {
        type: Schema.Types.Date,
        default: Date.now()
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
            type: Schema.Types.Number
        },
        discountGiver: {
            type: Operator
        }
    },
    status: {
        current: {
            type: OrderStatus
        },
        history: [OrderStatus]
    },
    statusHistory: {
        type: Schema.Types.String
    },
    description: {
        type: Schema.Types.String
    },
    shipping: {
        type: Shipping
    },
    archived: {
        type: Schema.Types.Boolean,
        default: false
    }
}, {timestamps: {}});

Order.index({orderNumber: 1});

module.exports = Order;
