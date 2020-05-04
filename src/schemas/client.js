//https://mongoosejs.com/docs/schematypes.html
const Schema = require('mongoose').Schema;

const Client = new Schema({
    username: {
        type: Schema.Types.String
    },
    password: {
        type: Schema.Types.String
    },
    wxUsername: {
        type: Schema.Types.String
    },
    wxToken: {
        type: Schema.Types.String
    },
    qqUsername: {
        type: Schema.Types.String
    },
    qqToken: {
        type: Schema.Types.String
    },
    aliUsername: {
        type: Schema.Types.String
    },
    aliToken: {
        type: Schema.Types.String
    },
    name:{
        type: Schema.Types.String
    },
    archived: {
        type: Schema.Types.Boolean,
        default: false
    }
}, {timestamps: {}});

module.exports = Client;
