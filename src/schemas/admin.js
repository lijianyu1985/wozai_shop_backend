//https://mongoosejs.com/docs/schematypes.html
const Schema = require('mongoose').Schema;

const Admin = new Schema({
    username: {
        type: Schema.Types.String
    },
    role: {
        type: Schema.Types.String,
        enum: ['super_admin', 'product_admin']
    },
    password: {
        type: Schema.Types.String
    },
    name:{
        type: Schema.Types.String
    },
    scope:{
        type: Schema.Types.String,
        default: 'admin'
    },
    fingerPrint:{
        type: Schema.Types.Number,
        default: 0
    },
    archived: {
        type: Schema.Types.Boolean,
        default: false
    }
}, {timestamps: {}});

module.exports = Admin;
