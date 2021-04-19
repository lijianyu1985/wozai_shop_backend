//https://mongoosejs.com/docs/schematypes.html
const Schema = require('mongoose').Schema;

const Address = new Schema({
    name: {
        type: Schema.Types.String
    },
    phone: {
        type: Schema.Types.String
    },
    province:{
        type: Schema.Types.String
    },
    city:{
        type: Schema.Types.String
    },
    county:{
        type: Schema.Types.String
    },
    address:{
        type: Schema.Types.String
    },
    areaValue:{
        type: Schema.Types.String
    },
    zipCode: {
      type: Schema.Types.String,
    },
    userId:{
        type: Schema.Types.String
    },
    default:{
        type: Schema.Types.Boolean,
        default: false
    },
    archived: {
        type: Schema.Types.Boolean,
        default: false
    }
}, {timestamps: {}});

module.exports = Address;
