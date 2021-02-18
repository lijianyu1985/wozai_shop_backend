//https://mongoosejs.com/docs/schematypes.html
const Schema = require('mongoose').Schema;

const Banner = new Schema({
    commodityId: {
        type: Schema.Types.String
    },
    commodityPhoto: {
        type: Schema.Types.String
    },
    order: {
        type: Schema.Types.Number
    },
}, {timestamps: {}});

module.exports = Banner;
