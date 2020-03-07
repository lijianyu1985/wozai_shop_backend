//https://mongoosejs.com/docs/schematypes.html
const Schema = require('mongoose').Schema;

const Return = new Schema({
    orderId: {
        type: Schema.Types.String
    },
    productId: {
        type: Schema.Types.String
    },
    skuId: {
        type: Schema.Types.String
    },
    description: {
        type: Schema.Types.String
    }
}, {timestamps: {}});

module.exports = Return;
