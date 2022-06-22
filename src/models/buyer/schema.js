

const mongoose = require("mongoose");
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name cannot be empty"]
    },
    address1: {
      type: String
    },
    address2: {
      type: String
    },
    address3: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    country: {    //change to world country, data from json file
        type: Number,
        required:[true, "Country cannot be empty."]
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Country",
      // required: [true, "Country cannot be empty."],
      // default: null,
      // set: function(value) {
      //   return value === "" ? null : value;
      // },
      // get: function(value) {
      //   return value === null ? "" : value;
      // }
    },
    zip: {
      type: String
    },
    phone: {
      type: String
    },
    startBuyingYear: {
      type: Date,
      required: [true, "Start Buying Year cannot be empty"]
    },
    remarks: {
      type: String
    },
    inactive: {
      type: Boolean,
      default: false
    },
    deleted: {
      type: Boolean,
      default: false
    },
    createdAt: {
        type: Date,
        set: timestampToDateTime
    },
    lastUpdatedAt: {
        type: Date,
        set: timestampToDateTime
    },
    createdBy: {
        type: mongoose.SchemaTypes.Mixed,
        required: [true, "Operator By cannot be empty"]
    },
    lastUpdatedBy: {
        type: mongoose.SchemaTypes.Mixed,
        required: [true, "Operator By cannot be empty"]
    }
  },
  {
    toObject: {
      getters: true,
      versionKey: false,
      transform: (doc, ret) => {
        return ret;
      }
    }
  }
);

schema.index({ name: 'text' })

module.exports = { schema };
