//https://mongoosejs.com/docs/schematypes.html
const Schema = require('mongoose').Schema;

const Coupon = new Schema({
    productId: {
        type: Schema.Types.String
    },
    orderId: {
        type: Schema.Types.String
    },
    description: {
        type: Schema.Types.String
    },
    logisticsCompany: {
        type: Schema.Types.String
    },
    logisticsNumber: {
        type: Schema.Types.String
    },
    logisticsStatus: {
        type: Schema.Types.String
    },
    startDate: {
        type: Schema.Types.Date
    },
    endDate: {
        type: Schema.Types.Date
    },
    startAddress: {
        type: Schema.Types.Date
    },
    endAddress: {
        type: Schema.Types.Date
    },
    archived: {
        type: Schema.Types.Boolean,
        default: false
    }
}, {timestamps: {}});

module.exports = Coupon;
