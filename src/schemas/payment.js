const Schema = require('mongoose').Schema;

const Payment = new Schema({
    transactionId:{//braintree transaction id
        type: Schema.Types.String,
        required: true
    },
    orderId:{//对应订单ID，可能为空
        type: Schema.Types.String
    },
    orderNumber:{//对应订单Number，可能为空
        type: Schema.Types.String,
        trim: true
    },
    payWay:{//支付途径
        type: Schema.Types.String
    },
    payerId:{//支付方ID
        type: Schema.Types.String,
        trim: true,
        required: true
    },
    transactionCreateAt:{//transaction创建时间
        type: Schema.Types.Date,
        trim: true,
        default: Date.now()
    },
    merchantAccountId:{//收款商户ID
        type: Schema.Types.String,
        trim: true,
        required: true
    },
    amount: {//金额
        type: Schema.Types.Number,
        required: true
    }
}, {timestamps: {}});

Payment.index({});

module.exports = Payment;
