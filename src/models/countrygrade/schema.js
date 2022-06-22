const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { timestampToDateTime } = require('../../services/app-serviceworkers');

function decimalConverter(value) {
  return parseFloat(value);
}
const schema = new Schema(
  {
    Country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: [true, 'Country cannot be Empty'],
    },
    CountryGrade: {
      type: String,
      required: [true, 'Country Grade cannot be Empty'],
    },
    CountryGrade_Lower: {
      type: String,
      lowercase: true,
      required: [true],
    },
    Commodity: {
      type: String,
      required: [true, 'Commodity cannot be Empty'],
    },
    Consignment: {
      type: String,
      required: [true, 'Consignment cannot be Empty'],
    },
    ProducingCountry: {
      type: String,
      required: [true, 'Producing Country cannot be Empty'],
    },
    Vk_Status: {
      type: Boolean,
      default: false,
    },
    Dirt_Param: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter,
    },
    Dirt_Limit: {
      type: Number,
      default: 1,
    },
    Dirt_TestMethod: {
      type: String,
      default: '',
    },
    Ash_Param: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter,
    },
    Ash_Limit: {
      type: Number,
      default: 1,
    },
    Ash_TestMethod: {
      type: String,
      default: '',
    },
    Volatile_Param: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter,
    },
    Volatile_Limit: {
      type: Number,
      default: 1,
    },
    Volatile_TestMethod: {
      type: String,
      default: '',
    },
    PO_Param: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter,
    },
    PO_Limit: {
      type: Number,
      default: 1,
    },
    PO_TestMethod: {
      type: String,
      default: '',
    },
    PRI_Param: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter,
    },
    PRI_Limit: {
      type: Number,
      default: 1,
    },
    PRI_TestMethod: {
      type: String,
      default: '',
    },
    Nitrogen_Param: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter,
    },
    Nitrogen_Limit: {
      type: Number,
      default: 1,
    },
    Nitrogen_TestMethod: {
      type: String,
      default: '',
    },
    Mooney_Param: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter,
    },
    Mooney_Limit: {
      type: Number,
      default: 1,
    },
    Mooney_TestMethod: {
      type: String,
      default: '',
    },
    Deleted: {
      type: Boolean,
      default: false,
    },
    CreatedAt: {
      type: String,
      default: '',
    },
    CreatedBy: {
      type: mongoose.SchemaTypes.Mixed,
    },
    LastUpdatedAt: {
      type: Date,
      set: timestampToDateTime,
    },
    LastUpdatedBy: {
      type: mongoose.SchemaTypes.Mixed,
    },
  },
  {
    toObject: {
      getters: true,
      versionKey: false,
      transform: (doc, ret) => {
        return ret;
      },
    },
  }
);

module.exports = { schema };
