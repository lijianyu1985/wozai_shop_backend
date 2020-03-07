//https://mongoosejs.com/docs/schematypes.html
const Schema = require('mongoose').Schema;

const Coupon = new Schema({
    productId: {
        type: Schema.Types.String
    },
    productCategoryId: {
        type: Schema.Types.String
    },
    description: {
        type: Schema.Types.String
    },
    discount: {
        type: Schema.Types.Number
    },
    discountPercentage: {
        type: Schema.Types.Number
    },
    startDate: {
        type: Schema.Types.Date
    },
    endDate: {
        type: Schema.Types.Date
    }
}, {timestamps: {}});

module.exports = Coupon;
