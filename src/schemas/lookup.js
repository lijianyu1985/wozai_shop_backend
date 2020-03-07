//https://mongoosejs.com/docs/schematypes.html
const Schema = require('mongoose').Schema;

const Coupon = new Schema({
    name: {
        type: Schema.Types.String
    },
    category: {
        type: Schema.Types.String
    },
    description: {
        type: Schema.Types.String
    }
}, {timestamps: {}});

module.exports = Coupon;
