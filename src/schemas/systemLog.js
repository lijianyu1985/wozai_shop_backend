const Schema = require('mongoose').Schema;

const SystemLog = new Schema({
    source: {//来源：order，sku，product，staff，client
        type: Schema.Types.String,
        trim: true,
        required: true
    },
    content: {//内容，可以使error对象，或者错误消息
        type: Schema.Types.Mixed
    }
}, {timestamps: {createdAt: 'created_at'}});

module.exports = SystemLog;
