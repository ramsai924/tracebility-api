

const mongoose = require("mongoose");
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');

const schema = new Schema(
  {
    code: {
      type: String,
      required: [true]
    },
    branch: {
      type: String,
      required: [true]
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: [true, "Country cannot be empty."],
      default: null,
      set: function(value) {
        return value === "" ? null : value;
      },
      get: function(value) {
        return value === null ? "" : value;
      }
    },
    remarks: {
      type: String,
      default: ""
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
      type: String,
      default:""
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

module.exports = { schema };
