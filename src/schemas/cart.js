//https://mongoosejs.com/docs/schematypes.html
const Schema = require('mongoose').Schema;

const Cart = new Schema({
    userId: {
        type: Schema.Types.String
    },
    products: [{
        id:{

            type: Schema.Types.String
        },
        count:{
            type: Schema.Types.Number
        }
    }]
}, {timestamps: {}});

module.exports = Cart;
