

const mongoose = require("mongoose");
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');

const schema = new Schema(
  {
    Factory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Factory",
      required: [true, "Factory cannot be empty."],
      default: null,
      set: function (value) {
        return value === "" ? null : value;
      },
      get: function (value) {
        return value === null ? "" : value;
      }
    },
    Datetime: {
      type: Date,
      required: [true, "Datetime cannot be empty"],
      set: function (value) {
        return new Date(value);
      },
      get: function (value) {
        return value;
      }
    },
    Shift: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
      required: [true, "Shift cannot be empty."],
      default: null,
      set: function (value) {
        return value === "" ? null : value;
      },
      get: function (value) {
        return value === null ? "" : value;
      }
    },
    DryerMachine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MachineList",
      required: [true, "Dryer machine cannot be empty."],
      default: null,
      set: function (value) {
        return value === "" ? null : value;
      },
      get: function (value) {
        return value === null ? "" : value;
      }
    },
    Buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
      required: [true, "Buyer cannot be empty."],
      default: null,
      set: function (value) {
        return value === "" ? null : value;
      },
      get: function (value) {
        return value === null ? "" : value;
      }
    },
    Grade: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductGrade",
      required: [true, "Grade cannot be empty."],
      default: null,
      set: function (value) {
        return value === "" ? null : value;
      },
      get: function (value) {
        return value === null ? "" : value;
      }
    },
    Type: {
      type: Number,
      default: 1
    },
    Lot: {
      type: String,
      default: ""
    },
    Val1: {
      type: Number,
      default: 0
    },
    Val2: {
      type: Number,
      default: 0
    },
    Timer: {
      type: Number,
      default: 0
    },
    Temp1: {
      type: Number,
      default: 0
    },
    Temp2: {
      type: Number,
      default: 0
    },
    Temp3: {
      type: Number,
      default: 0
    },
    Temp4: {
      type: Number,
      default: 0
    },
    Temp5: {
      type: Number,
      default: 0
    },
    Temp6: {
      type: Number,
      default: 0
    },
    BiscuitTemp: {
      type: Number,
      default: 0
    },
    BiscuitWeight: {
      type: Number,
      default: 0
    },
    Event: {
      type: String,
      default: ""
    },
    Deleted: {
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
  }
);

module.exports = { schema };
