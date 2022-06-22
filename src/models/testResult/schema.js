

const mongoose = require("mongoose");
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');


function decimalConverter(value){
  return parseFloat(value);
}

const schema = new Schema(
  {
    Pallet: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Pallet cannot be empty"],
      ref: 'Pallet'
    },
    SampleNo: {
      //type: mongoose.Schema.Types.Number,
        type: mongoose.Schema.Types.String,
      required: [true, 'Sample No cannot be empty.']
    },
    Dirt: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0.00,
      set: decimalConverter,
      get: decimalConverter
    },
    Ash: {
      type:  mongoose.Schema.Types.Decimal128,
      default: 0.00,
      set: decimalConverter,
      get: decimalConverter
    },
    VM: {
      type:  mongoose.Schema.Types.Decimal128,
      default: 0.00,
      set: decimalConverter,
      get: decimalConverter
    },
    Nitrogen: {
      type:  mongoose.Schema.Types.Decimal128,
      default: 0.00,
      set: decimalConverter,
      get: decimalConverter
    },
    PO: {
      type:  mongoose.Schema.Types.Decimal128,
      default: 0.00,
      set: decimalConverter,
      get: decimalConverter
    },
    P30: {
      type:  mongoose.Schema.Types.Decimal128,
      default: 0.00,
      set: decimalConverter,
      get: decimalConverter
    },
    PRI: {
          type:  mongoose.Schema.Types.Decimal128,
          default: 0.00,
          set: decimalConverter,
          get: decimalConverter
    },
    Mooney: {
          type:  mongoose.Schema.Types.Decimal128,
          default: 0.00,
          set: decimalConverter,
          get: decimalConverter
    },
    Gel: {
          type:  mongoose.Schema.Types.Decimal128,
          default: 0.00,
          set: decimalConverter,
          get: decimalConverter
    },
    SVI: {
          type:  mongoose.Schema.Types.Decimal128,
          default: 0.00,
          set: decimalConverter,
          get: decimalConverter
    },
    Asht: {
          type:  mongoose.Schema.Types.Decimal128,
          default: 0.00,
          set: decimalConverter,
          get: decimalConverter
    },
    Offspec: {
          type:  mongoose.Schema.Types.Boolean,
          default: false
    },
    Remarks: {
      type: String,
      default: ""
    },
    Inactive:{
      type: Boolean,
      default: false
    },
    TestResultStatus:{
      type: mongoose.Schema.Types.Boolean,
      default: false
    },
    CreatedAt: {
   type: Date,
   set: timestampToDateTime
        },
    CreatedBy:{
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
  }
);

module.exports = { schema };
