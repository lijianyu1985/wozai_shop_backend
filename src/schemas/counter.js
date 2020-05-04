//https://mongoosejs.com/docs/schematypes.html
const Schema = require('mongoose').Schema;

const Counter = new Schema({
    type: {
        type: String,
        trim: true,
        default: 'unknown',
        required: true
    }, //counter 的类型，如order，
    seq: {
        type: Number,
        min: 1,
        required: true
    }, //自增序列号
    extend: Schema.Types.Mixed //预留字段，提供将来扩展
});

module.exports = Counter;
