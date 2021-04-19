import commonSerivice from "./../services/common";

async function getMerchantAddress(request, h) {
  const System = request.mongo.models.System;
  const system = await commonSerivice.getByQuery(System, {});
  console.log(system);
  return {
    success: true,
    address: system.address,
  };
}

export default {
  getMerchantAddress,
};
