

const mongoose = require("mongoose");
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');
// const StorageLocation_Detail = require("../../models/storageLocation-detail/model");

const schema = new Schema({
        Factory: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Factory cannot be empty."],
            ref: 'Factory'
        },
        StorageNo: {
            type: String,
            required: [true, "RM storage number cannot be empty."],
        },
        Capacity: {
            type: Number,
            required: [true, "Capacity cannot be empty."],
        },
        Format: {
            type: String,
            required: [true, "Format cannot be empty."],
        },
        Remarks: {
            type: String,
            default: ""
        },
        // Details: [StorageLocation_Detail.schema],
        Inactive: {
            type: Boolean,
            default: false
        },
        Deleted: {
            type: Boolean,
            default: false
        },
        CreatedAt: {
           type: Date,
           set: timestampToDateTime,
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
    }, {
        toObject: {
            getters: true,
            versionKey: false,
            transform: (doc, ret) => {
                // let details = ret.Details.sort((a, b) => (a.Period > b.Period) ? -1 : (a.Period === b.Period) ? ((a.LastNumbering > b.LastNumbering) ? -1 : 1) : 1);
                // let lastDetail = details[0];
                // ret.StatusFull = lastDetail.StatusFull;
                // ret.StatusEmpty = lastDetail.StatusEmpty;
                // ret.LastNumbering = lastDetail.LastNumbering;
                // ret.NumberResult = lastDetail.NumberResult;
                // ret.NumberStartPeriod = `${lastDetail.Period.slice(0, 4)}/${lastDetail.Period.slice(4, 6)}/01`;
                return ret;
            }
        }
    }
);
module.exports = {schema};
