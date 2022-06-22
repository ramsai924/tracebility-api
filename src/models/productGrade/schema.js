

const mongoose = require("mongoose");
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');
function decimalConverter(value) {
  return parseFloat(value);
}
const schema = new Schema(
  {
    // GradeGroup: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "ProductGradeGroup",
    //   required: [true, "Product grade group cannot be empty."],
    //   default: null,
    //   set: function(value) {
    //     return value === "" ? null : value;
    //   },
    //   get: function(value) {
    //     return value === null ? "" : value;
    //   }
    // },
      GradeGroup:{
          type: Number,
          required: [true, "Product grade group cannot be empty."]
      },
    GradeCode: {
      type: String,
      required: [true, "Product code cannot be empty."]
    },
    GradeName: {
      type: String,
      required: [true, "Product name cannot be empty."]
    },
    GradeCountry: {
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
    GradeCountryGrd: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CountryGrade",
      required: [true, "Country Grade cannot be empty."],
      default: null,
      set: function(value) {
        return value === "" ? null : value;
      },
      get: function(value) {
        return value === null ? "" : value;
      }
    },
    GradeBuyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
      default: null,
      set: function(value) {
        return value === "" ? null : value;
      },
      get: function(value) {
        return value === null ? "" : value;
      }
    },
    GradeBuyerProdCode: {
      type: String,
      default: ""
    },
    GradeDesc: {
      type: String,
      default: ""
    },
      GradeLCL: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
      GradeUCL: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   POLSL: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   POCenter: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   POUSL: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   PRILSL: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   PRICenter: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   PRIUSL: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   DirtLSL: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   DirtCenter: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   DirtUSL: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   VMLSL: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   VMCenter: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   VMUSL: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   AshLSL: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   AshCenter: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   AshUSL: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   NitrogenLSL: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   NitrogenCenter: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   NitrogenUSL: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   MooneyLSL: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   MooneyCenter: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   MooneyUSL: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   AshtLSL: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   AshtCenter: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
   AshtUSL: {
      type: mongoose.SchemaTypes.Decimal128,
      default: 0.0,
      set: decimalConverter,
      get: decimalConverter
    },
    GradeDeleted: {
      type: Boolean,
      default: false
    },
    GradeInactive: {
      type: Boolean,
      default: false
    },
    GradeCreatedAt: {
   type: Date,
   set: timestampToDateTime
    },
    GradeCreatedBy: {
        type: mongoose.SchemaTypes.Mixed,
        required: [true, "Operator By cannot be empty"]
    },
    GradeLastUpdatedAt: {
   type: Date,
   set: timestampToDateTime
},
    GradeLastUpdatedBy: {
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
