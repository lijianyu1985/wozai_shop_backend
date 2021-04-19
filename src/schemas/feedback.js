const Schema = require('mongoose').Schema;

const Feedback = new Schema({
    userId:{
        type: Schema.Types.String,
        required: true
    },
    name:{
        type: Schema.Types.String,
        required: true
    },
    phone:{
        type: Schema.Types.String,
        required: true
    },
    email:{
        type: Schema.Types.String
    },
    content:{
        type: Schema.Types.String,
        trim: true,
        required: true
    },
}, {timestamps: {}});

Feedback.index({});

module.exports = Feedback;
