const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');
const CommonModel = require('../baseschemas/commonmmodel-baseschema/model');
const BuyerApprovedGrade= require('./buyerApprovalGrade/model');

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
        StartBuyingYear: {
            type: Date,
            required: [true, "Start buying year cannot be empty"]
        },
        Remarks: {
            type: String,
            default: ""
        },
        Inactive: {
            type: Boolean,
            default: false
        },
        VKStatus: {
            type: Boolean,
            default: false
        },
        POStatus: {
            type: Boolean,
            default: false
        },
        PRIStatus: {
            type: Boolean,
            default: false
        },
        BuyerApprovedGrade: [BuyerApprovedGrade.schema],
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
