//https://mongoosejs.com/docs/schematypes.html
const Schema = require('mongoose').Schema;

const Comment = new Schema({
    productId: {
        type: Schema.Types.String
    },
    orderId: {
        type: Schema.Types.String
    },
    description: {
        type: Schema.Types.String
    }
}, {timestamps: {}});

module.exports = Comment;
