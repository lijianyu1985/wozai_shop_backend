export function createExpress(sender, receiver, count, weight) {
  //创建快递订单并返回订单号和公司名
  return {
    number: "123456789",
    company: "shunfeng",
  };
}

export function queryHistory(number) {
  //返回快递历史记录
  return [
    {
      status: "已下单",
      stamp: new Date(),
    },
    {
      status: "打包中",
      stamp: new Date(),
    },
    {
      status: "已发往北京",
      stamp: new Date(),
    },
    {
      status: "已签收",
      stamp: new Date(),
    },
  ];
}

//定时主动轮询，还是被动实时订阅？

export default {
  createExpress,
  queryHistory,
};
