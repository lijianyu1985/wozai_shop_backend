import systemLogServices from "../../services/systemLog";
import commonService from "../../services/common";
import { CronJob } from "cron";
import mongooseHelpers from "../mongooseHelpers";
import { orderStatusMap } from "../const";

// 在页面点击打印才生成面单并打印
//间隔时间内检查订单并生成已经支付15分钟的订单
async function generateKuaidi100eOrder() {
  const mongo = await mongooseHelpers.connect();
  const Order = mongo.model("Order");
  const Systemlog = mongo.model("Systemlog");
  //touched paidTimestamp
  const currentTimestamp = new Date();
  currentTimestamp.setMinutes(currentTimestamp.getMinutes() - 15);
  const orders = await commonService.find(Order, {
    "status.current.name": orderStatusMap.Paid,
    paidTimestamp: { $lt: currentTimestamp },
    shipping: { $in: [null, undefined] },
  });
  await (orders || []).forEach(async (order) => {
    try {
      order.status.history.push(Object.assign({}, order.status.current));
      order.status.current = {
        name: orderStatusMap.Delivering,
        comment: "",
        operatorType: "admin",
        operatorId: {
          id: "system",
          name: "system cron job",
        },
      };
      //调用接口生成快递信息，并且更新订单快递数据
      
      const newOrder = await Order.findByIdAndUpdate(order._id, order, {
        new: true,
      });
      await Promise.all(
        (newOrder.commodityItems || []).map(async (commodityItem) => {
          try {
            await Sku.findOneAndUpdate(
              { _id: commodityItem.sku._id },
              { $inc: { amount: commodityItem.count } },
              { new: true, upsert: true }
            );
          } catch (err) {
            await systemLogService.insertSystemLog(
              Systemlog,
              "order.cancel",
              err
            );
          }
        })
      );
    } catch (err) {
      await systemLogServices.insertSystemLog(
        Systemlog,
        "common.generateKuaidi100eOrder",
        err
      );
    }
  });
  return orders;
}

//https://github.com/kelektiv/node-cron
const generateKuaidi100eOrderCronJob = new CronJob(
  "0 */1 * * * *",
  () => {
    generateKuaidi100eOrder().then((res) => {
      console.log(res);
    });
  },
  null,
  true,
  "Asia/Shanghai"
);

export default generateKuaidi100eOrderCronJob;
