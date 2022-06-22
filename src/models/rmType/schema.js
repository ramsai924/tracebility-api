

const mongoose = require("mongoose");
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');

const schema = new Schema(
  {
    Name: {
      type: String,
      required: [true, "Name cannot be empty."]
    },
    Description: {
      type: String,
      default: ""
    },
    Inactive: {
      type: Boolean,
      default: false
    },
    Deleted: {
      type: Boolean,
      default: false
    },
    CreatedAt: {
   type: Date,
   set: timestampToDateTime
    },
    LastUpdatedAt: {
   type: Date,
   set: timestampToDateTime
},

    CreatedBy: {
        type: mongoose.SchemaTypes.Mixed,
        required: [true, "Operator By cannot be empty"]
    },
    LastUpdatedBy: {
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
