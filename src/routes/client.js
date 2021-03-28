// hapi-swagger guide
// https://github.com/glennjones/hapi-swagger/blob/master/usageguide.md

// joi guide
// https://github.com/hapijs/joi/blob/v14.3.0/API.md
import handlers from "../handlers/client";
import Joi from "@hapi/joi";

export default [
  {
    method: "POST",
    path: "/Client/wxCheckToken",
    handler: handlers.wxCheckToken,
    config: {
      description: "微信验证Token",
      tags: ["api", "client", "wx"],
      auth: false,
      validate: {
        payload: Joi.object()
          .keys({
            token: Joi.string().required(),
          })
          .label("wxCheckToken"),
      },
    },
  },
  {
    method: "POST",
    path: "/Client/wxRegisterComplex",
    handler: handlers.wxRegisterComplex,
    config: {
      description: "微信注册",
      tags: ["api", "client", "wx"],
      auth: false,
      validate: {
        payload: Joi.object()
          .keys({
            code: Joi.string().required(),
            encryptedData: Joi.string(),
            iv: Joi.string(),
            referrer: Joi.string()
              .allow(null)
              .allow(""),
          })
          .label("wxRegisterComplex"),
      },
    },
  },
  {
    method: "POST",
    path: "/Client/wxLogin",
    handler: handlers.wxLogin,
    config: {
      description: "微信登录",
      tags: ["api", "client", "wx"],
      auth: false,
      validate: {
        payload: Joi.object()
          .keys({
            code: Joi.string().required(),
            nickName: Joi.string()
              .allow("")
              .allow(null),
            avatarUrl: Joi.string()
              .allow("")
              .allow(null),
          })
          .label("wxLogin"),
      },
    },
  },
  {
    method: "POST",
    path: "/Client/wxBasic",
    handler: handlers.wxBasic,
    config: {
      description: "用户基本信息",
      tags: ["api", "client", "wx"],
      auth: {
        scope: 'wx'
      },
    },
  },
  {
    method: "GET",
    path: "/Client/defaultAddress",
    handler: handlers.defaultAddress,
    config: {
      description: "用户默认地址",
      tags: ["api", "client", "wx"],
      auth: {
        scope: "wx",
      },
    },
  },
];
