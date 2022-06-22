

const mongoose = require("mongoose");
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');
const CommonModel = require('../baseschemas/commonmmodel-baseschema/model');

const schema = new Schema(
    {
        Factory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Factory",
            required: [true, "Factory cannot be empty."],
        },
        ShippingInstruction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ShippingInstruction",
            required: [true, "Shipping Instruction cannot be empty."],
            default: null,
            set: function (value) {
                return value === "" ? null : value;
            },
            get: function (value) {
                return value === null ? "" : value;
            }
        },

        Date: {
            type: Date,
            required: [true, "Date cannot be empty"],
            set: function (value) {
                return new Date(value).toISOString().split("T")[0];
            },
            get: function (value) {
                return value;
            }
        },
        ContainerDetail: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ContainerDetail",
            default: null,
            set: function (value) {
                return value === "" ? null : value;
            },
            get: function (value) {
                return value === null ? "" : value;
            }
        },
        //Cleanliness: CommonModel.schema,
        Weather: CommonModel.schema,
        StuffingLocation: CommonModel.schema,
        ShippingMethod: CommonModel.schema,

        Remarks: {
            type: mongoose.Schema.Types.String,
            default: ""
        },
        Pallet: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pallet"
        }],
        SequenceNumber: {
            type: mongoose.Schema.Types.Number,
            default: 1
        },
        OnCheckSheet: {
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

module.exports = {schema};
