const mongoose = require('mongoose');
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');


function decimalConverter(value){
    return parseFloat(value);
}

const schema = new Schema(
  {
    Country: {
      ref:'Country',
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Country cannot be Empty']
    },
    Province : {
      ref:'Province',
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Province cannot be Empty']
    },
    District : {
      ref: 'District',
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'District cannot be Empty']
    },
    SubDistrict : {
       type: mongoose.Schema.Types.String,
       required: [true, 'Sub District cannot be Empty']
    },
    AreaSize  : {
      type: mongoose.Schema.Types.Decimal128,
      default: 0.00,
      get: decimalConverter,
      set: decimalConverter
    },
    OfIsland  : {
       type: mongoose.Schema.Types.Decimal128,
       default: 0.00,
        get: decimalConverter,
        set: decimalConverter
    },
    OfVillage  : {
       type: mongoose.Schema.Types.Decimal128,
       default: 0.00,
        get: decimalConverter,
        set: decimalConverter
    },
    Latitute: {
       type: mongoose.Schema.Types.Decimal128,
       default: 0.00,
        get: decimalConverter,
        set: decimalConverter
    },
    Longitude: {
       type: mongoose.Schema.Types.Decimal128,
       default: 0.00,
        get: decimalConverter,
        set: decimalConverter
    },
    Changed: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    Remarks: {
      type: mongoose.Schema.Types.String,
      default: ''
    },
    Deleted: {
        type: mongoose.Schema.Types.Boolean,
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
    }
);

module.exports = { schema };
