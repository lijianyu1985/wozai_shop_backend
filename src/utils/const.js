export const commodityStatus = ['预上线', '已上线', '已下线', '禁用'];
export const commodityStatusMap = {
    'preOnline':'预上线',
    'online':'已上线',
    'offline':'已下线',
    'discarded':'禁用'
};

export const orderStatus = ['已创建', '已支付', '快递中', '已取消', '已退款（取消）', '未退款（取消）', '已完成', "已申请退货","已拒绝退货","已同意退货",'快递中（退货）',"已退货","已退款（退货）","未退款（退货）","异常订单"];
export const orderStatusMap = {
    'Created':'已创建',
    'Paid':'已支付',
    'Delivering':'快递中',
    'Canceled':'已取消',
    'CanceledRefund':'已退款（取消）',
    'CanceledUnRefund':'未退款（取消）',
    'Completed':'已完成',
    'ReturnApplied':'已申请退货',
    'ReturnRefused':'已拒绝退货',
    'ReturnApproved':'待退货退回',
    'ReturnDelivering':'快递中(退货)',
    'Returned':'已退货',
    'ReturnRefund':'已退款（退货）',
    'ReturnUnRefund':'未退款（退货）',
    'Exception':'异常订单',
};
export const orderStatusCancelable=[
    orderStatusMap.Created,
    orderStatusMap.Paid
];

export const shippingStatus = ['已下单', '处理中', '运输中', '派送中', '已签收','异常订单'];
export const shippingStatusMap = {
    'Created':'已下单',
    'Processing':'处理中',
    'Shipping':'运输中',
    'Delivering':'派送中',
    'Received':'已签收',
    'Exception':'异常',
};

export const paymentStatus = ['已支付', '申请退款', '已退款', '未退款','异常'];
export const paymentStatusMap = {
    'Paid':'已支付',
    'ApplingRefund':'申请退款',
    'Refunded':'已退款',
    'UnRefund':'未退款',
    'Exception':'异常',
};
