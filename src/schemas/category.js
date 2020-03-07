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
    }
}, {timestamps: {}});

module.exports = Category;
