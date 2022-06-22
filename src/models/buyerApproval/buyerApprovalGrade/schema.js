const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { timestampToDateTime, toDateToTimeStamp } = require("../../../services/app-serviceworkers");
const CommonModel = require('../../baseschemas/commonmmodel-baseschema/model');
const BuyerApprovedGrade_Detail= require('./buyerApprovalGrade-detail/model');
const schema = new Schema(
    {
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
        StatusDate: {
            type: Date,
            required: [true, "Status date cannot be empty."],
            set: function (value) {
                return new Date(value).toISOString().split("T")[0];
            },
            get: function (value) {
                return value;
            },
            default: Date.now()
        },
        ApprovalStatus:CommonModel.schema,
        Remarks: {
            type: String,
            default: ""
        },
        Inactive: {
            type: Boolean,
            default: false
        },
        BuyerApprovedGrade_Detail:BuyerApprovedGrade_Detail.schema
        //     {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "BuyerApprovedGrade_Detail",
        //     default:null
        // }
        // CreatedAt: {
        //     type: Date,
        //     default: Date.now()
        // },
        // CreatedBy: {
        //     type: String,
        //     default: "Admin"
        // },
        // LastUpdatedAt: {
        //     type: Date,
        //     default: Date.now()
        // },
        // LastUpdatedBy: {
        //     type: String,
        //     default: "Admin"
        // }
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
