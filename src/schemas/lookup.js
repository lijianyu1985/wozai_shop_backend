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
    },
    archived: {
        type: Schema.Types.Boolean,
        default: false
    }
}, {timestamps: {}});

module.exports = Coupon;
