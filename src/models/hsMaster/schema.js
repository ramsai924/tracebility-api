

const mongoose = require("mongoose");
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');

const schema = new Schema({
        Factory: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Factory cannot be empty."],
            ref: 'Factory'
        },
        HSNo: {
            type: String,
            required: [true, "HS number cannot be empty."],
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
    }, {
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
