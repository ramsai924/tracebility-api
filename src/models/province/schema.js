const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');

function decimalConverter(value){
  return parseFloat(value);
}

const schema = new Schema({
  Country: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Country is required'],
    ref: 'Country'
  },
  Name: {
    type: mongoose.Schema.Types.String,
    required: [true, "Province Name cannot be empty."]
  },
  Description: {
    type: mongoose.Schema.Types.String,
    default: ""
  },
  Lat: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
    get: decimalConverter,
    set: decimalConverter
  },
  Long: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
    get: decimalConverter,
    set: decimalConverter
  },
  Inactive: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  Deleted: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  CreatedAt: {
    type: mongoose.Schema.Types.Date,
    set: timestampToDateTime
  },
  CreatedBy: {
    type: mongoose.SchemaTypes.Mixed,
    required: [true, "Operator By cannot be empty"]
  },
  UpdatedAt: {
    type: mongoose.Schema.Types.Date,
    set: timestampToDateTime
  },
  LastUpdatedBy: {
    type: mongoose.SchemaTypes.Mixed,
    required: [true, "Operator By cannot be empty"]
  }
}, {
      toObject: {
        getters: true,
        versionKey: false,
        transform: (doc, ret) => {
          return ret;
        }
      }
});

module.exports = { schema };
