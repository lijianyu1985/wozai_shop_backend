import tenpay from "tenpay";
import Config from "getconfig";

const { appId, mchId, partnerKey, payNotifyUrl, refundUrl } = Config.wxConfig;

const config = {
  appid: appId,
  mchid: mchId,
  partnerKey,
  //pfx: require('fs').readFileSync('证书文件路径'),
  notify_url: payNotifyUrl,
  refund_url: refundUrl,
};

//const api = new tenpay(config);
const api = new tenpay(config, true);


export async function unifiedOrder(out_trade_no, total_fee, openid) {
// 沙盒模式(用于微信支付验收)
const sandboxAPI = await tenpay.sandbox(config,true);
  return await sandboxAPI.unifiedOrder({
    out_trade_no,
    body: out_trade_no,
    total_fee,
    openid,
  });
}

export default {
  unifiedOrder,
};
