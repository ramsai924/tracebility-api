

const mongoose = require("mongoose");
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');

const schema = new Schema({
  PckTypeName: {
    type: String,
    required: [true, "Pack Type Name cannot be empty"],
    // unique: true,
    // dropDups: true,
    //index: true
  },
  PckTypeDesc: {
    type: String
  },
  PckTypeInactive: {
    type: Boolean,
    default: false
  },
  PckTypeInactiveDel: {
    type: Boolean,
    default: false
  },
  CreatedAt: {
   type: Date,
   set: timestampToDateTime
  },
  CreatedBy: {
    type: mongoose.SchemaTypes.Mixed,
    required: [true, "Operator By cannot be empty"]
  },
  LastUpdatedAt: {
    type: Date,
    set: timestampToDateTime
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
  });

module.exports = { schema };
