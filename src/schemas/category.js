//https://mongoosejs.com/docs/schematypes.html
const Schema = require('mongoose').Schema;

const Category = new Schema({
    name: {
        type: Schema.Types.String
    },
    description: {
        type: Schema.Types.String
    },
    icon:{
        type: Schema.Types.String
    },
    archived: {
        type: Schema.Types.Boolean,
        default: false
    }
}, {timestamps: {}});

module.exports = Category;
