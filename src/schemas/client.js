//https://mongoosejs.com/docs/schematypes.html
const Schema = require('mongoose').Schema;

const Client = new Schema({
    username: {
        type: Schema.Types.String
    },
    password: {
        type: Schema.Types.String
    },
    wxOpenId: {
        type: Schema.Types.String
    },
    wxNickName: {
        type: Schema.Types.String
    },
    wxAvatarUrl: {
        type: Schema.Types.String
    },
    wxSessionKey: {
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
