import errors from "../utils/errors";
import commonService from "../services/common";
import counterService from "../services/counter";
import Number from "../utils/number";
import systemLogService from "../services/systemLog";
import mongooseHelpers from "../utils/mongooseHelpers";
import { calculateShippingFee as shippingFee } from "../utils/settings";
import { orderStatusMap } from "../utils/const";
import { unifiedOrder } from "../utils/wxPay";

async function wxCreate(request, h) {
  const { /*address,*/ commodityItems } = request.payload;
  const userId =
    request.auth && request.auth.credentials && request.auth.credentials.id;
  const { Systemlog, Counter } = request.mongo.models;
  // 检查库存
  const skuNotEnoughList = [];
  await Promise.all(
    (commodityItems || []).map(async (commodityItem) => {
      try {
        const sku = await commonService.getById(
          request.mongo.models.Sku,
          commodityItem.sku._id,
          "amount"
        );
        if (sku.amount < commodityItem.count) {
          skuNotEnoughList.push(sku);
        }
      } catch (err) {
        await systemLogService.insertSystemLog(
          Systemlog,
          "order.wxCreate",
          err
        );
      }
    })
  );
  if (skuNotEnoughList.length) {
    return {
      error: Object.assign({}, errors.order.skuAmountNotEnough, {
        skus: skuNotEnoughList,
      }),
    };
  }
  // sku减少库存 创建订单

  try {
    const mongo = await mongooseHelpers.connect();
    const Order = mongo.model("Order");
    const Sku = mongo.model("Sku");

    const session = await mongo.startSession();
    await session.startTransaction();
    try {
      let commodityCost = 0;
      const opts = { session, new: true };
      await Promise.all(
        (commodityItems || []).map(async (commodityItem) => {
          try {
            await Sku.findOneAndUpdate(
              { _id: commodityItem.sku._id },
              { $inc: { amount: 0 - commodityItem.count } },
              { new: true, upsert: true }
            );
            commodityCost =
              commodityCost + commodityItem.count * commodityItem.sku.price;
          } catch (err) {
            await systemLogService.insertSystemLog(
              Systemlog,
              "order.wxCreate",
              err
            );
          }
        })
      );
      // const shippingFee = calculateShippingFee(
      //   address,
      //   commodityItems,
      //   request
      // );
      const total = commodityCost; // + shippingFee;
      // generate order number
      const orderNumber = [
        Number.prefixInteger(
          await counterService.getNextSeq(Counter, "order"),
          8
        ),
      ].join("");

      const newOrder = {
        orderNumber,
        userId: userId,
        //address,
        commodityItems,
        rate: {
          commodityCost,
          //shippingFee,
          total,
        },
        description: "",
      };

      const order = await commonService.insert(Order, newOrder);

      await session.commitTransaction();
      session.endSession();
      return { success: true, order };
    } catch (err) {
      try {
        await session.abortTransaction();
        session.endSession();
      } catch (innErr) {
        await systemLogService.insertSystemLog(
          Systemlog,
          "order.abortTransaction",
          innErr
        );
      }
      if (err.code && err.msg) {
        await systemLogService.insertSystemLog(Systemlog, "order.error", err);
        return {
          error: err,
        };
      }
      await systemLogService.insertSystemLog(
        Systemlog,
        "order.unexpected.error",
        err
      );
      return {
        error: Object.assign({}, errors.unexpectedError, { info: err.message }),
      };
    }
  } catch (err) {
    await systemLogService.insertSystemLog(
      Systemlog,
      "order.unexpected.error",
      err
    );
  }

  return {
    success: true,
  };
}

async function wxUpdateAddressAndDes(request, h) {
  const { id, address, description, shippingFee } = request.payload;
  const userId =
    request.auth && request.auth.credentials && request.auth.credentials.id;
  const { Order, Client } = request.mongo.models;
  const order = await commonService.getById(Order, id);
  const client = await commonService.getById(Client, userId);
  const total = order.rate.commodityCost + shippingFee;
  await commonService.updateById(Order, id, {
    address,
    description,
    "rate.shippingFee": shippingFee,
    "rate.total": total,
  });
  // try {
  //   const prePayResult = await unifiedOrder(
  //     order.orderNumber,
  //     total,
  //     client.wxOpenId
  //   );
  // } catch (err) {
  //   return {
  //     success: false,
  //     error: Object.assign({}, errors.order.wxPrePayException, {
  //       msg: `${errors.order.wxPrePayException.msg}:${err.message}`,
  //     }),
  //     total,
  //   };
  // }
  return {
    success: true,
    total,
    payment: {
      timeStamp: "1616848082433",
      nonceStr: "5K8264ILTKCH16CQ2502SI8ZNMTM67VS",
      package: "161684808243316168480824331616848082433",
      signType: "MD5",
      paySign: "5K8264ILTKCH16CQ2502SI8ZNMTM67VS",
      totalFee: total,
    },
  };
}

async function wxGet(request, h) {
  const { orderId } = request.payload;
  const { Order } = request.mongo.models;

  const order = await commonService.getById(Order, orderId);
  if (!order || !order._id) {
    return { success: false, error: errors.order.noOrderBeFound };
  }
  return { success: true, order };
}

async function wxRetryLatestCeated(request, h) {
  const { Order } = request.mongo.models;
  const userId =
    request.auth && request.auth.credentials && request.auth.credentials.id;
  const order = await commonService.getByQuery(
    Order,
    { userId, status: orderStatusMap.Created },
    null,
    { sort: "createdAt" }
  );
  if (!order || !order._id) {
    return { success: false, error: errors.order.noCreatedOrderBeFound };
  }
  await commonService.updateById(Order, order._id, {
    touchedTime: Date.now(),
  });
  return { success: true, order };
}

async function calculateShippingFee(request, h) {
  const { Order } = request.mongo.models;
  const { orderId, areaValue } = request.query;
  const order = await commonService.getById(Order, orderId);
  const fee = shippingFee(areaValue, order.commodityItems, request);
  return { success: true, shippingFee: fee };
}

async function page(request, h) {
  const { status, page = 1, size = 10 } = request.query;
  const { Order } = request.mongo.models;
  const userId =
    request.auth && request.auth.credentials && request.auth.credentials.id;
  const queryObject = { userId };
  if (status) {
    queryObject.status = status;
  }
  const total = await Order.count(queryObject);
  const list = await Order.find(queryObject)
    .sort({ createdAt: -1 })
    .limit(size)
    .skip((page - 1) * size);
  return {
    success: true,
    list,
    page,
    size,
    total,
  };
}

export default {
  wxCreate,
  wxGet,
  wxRetryLatestCeated,
  calculateShippingFee,
  wxUpdateAddressAndDes,
  page,
};
