

const mongoose = require("mongoose");
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');
const schema = new Schema({
    Factory: {
        ref: 'Factory',
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Factory cannot be empty.']
    },
    Datetime: {
        type: mongoose.Schema.Types.Date,
        default: null,
        set: function (value) {
            return value !== null && value !== undefined ? new Date(value) : value;
        },
        get: function (value) {
            return value;
        }
    },
    Shift: {
        ref: 'Shift',
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Shift cannot be empty.']
    },
    RMWetProcess: {
        ref: 'RMWetProcess',
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Wet process cannot be empty.']
    },
    BlanketQty: {
        type: mongoose.Schema.Types.Number,
        default: 0
    },
    HSMaster_Detail: {
        ref: 'HSMaster_Detail',
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'HS cannot be empty.']
    },
    Remarks: {
        type: mongoose.Schema.Types.String,
        default: ""
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
});
module.exports = {schema};
