import systemLogServices from "../../services/systemLog";
import commonService from "../../services/common";
import { CronJob } from "cron";
import mongooseHelpers from "../mongooseHelpers";
import { orderStatusMap } from "../const";

async function cancelOrderAutomatically() {
  const mongo = await mongooseHelpers.connect();
  const Order = mongo.model("Order");
  const Sku = mongo.model("Sku");
  const Systemlog = mongo.model("Systemlog");
  //touched touchedTimestamp
  const currentTimestamp = new Date();
  currentTimestamp.setMinutes(currentTimestamp.getMinutes()-15);
  const orders = await commonService.find(Order, {
    "status.current.name": orderStatusMap.Created,
    touchedTimestamp: { $lt: currentTimestamp },
  });
  await (orders || []).forEach(async (order) => {
    try {
      order.status.history.push(Object.assign({}, order.status.current));
      order.status.current = {
        name: orderStatusMap.Canceled,
        comment: "",
        operatorType: "admin",
        operatorId: {
          id: 'system',
          name: 'system cron job',
        },
      };
      const newOrder = await Order.findByIdAndUpdate(order._id, order, { new: true });
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
        "common.cancelOrderAutomatically",
        err
      );
    }
  });
  return orders;
}

//https://github.com/kelektiv/node-cron
const cancelOrderAutomaticallyCronJob = new CronJob(
  "0 */1 * * * *",
  () => {
    cancelOrderAutomatically().then((res) => {
      console.log(res);
    });
  },
  null,
  true,
  "Asia/Shanghai"
);

export default cancelOrderAutomaticallyCronJob;
