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
    },
    archived: {
        type: Schema.Types.Boolean,
        default: false
    }
}, {timestamps: {}});

module.exports = Comment;
