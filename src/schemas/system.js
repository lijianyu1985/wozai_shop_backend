const Schema = require("mongoose").Schema;

const System = new Schema(
  {
    address: {
      name: {
        type: Schema.Types.String,
      },
      phone: {
        type: Schema.Types.String,
      },
      province: {
        type: Schema.Types.String,
      },
      city: {
        type: Schema.Types.String,
      },
      county: {
        type: Schema.Types.String,
      },
      address: {
        type: Schema.Types.String,
      },
      areaValue: {
        type: Schema.Types.String,
      },
      zipCode: {
        type: Schema.Types.String,
      },
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = System;
