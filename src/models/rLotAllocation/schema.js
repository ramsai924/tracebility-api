

const mongoose = require("mongoose");
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');
const schema = new Schema({
    Factory: {
        ref: 'Factory',
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Factory cannot be empty.']
    },
    RLot: {
        ref: 'RLot',
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'R Lot cannot be empty.']
    },
    Status: {
        type: Boolean,
        default: false   //false: open, true: close
    },
    RLotClosedDate: {
        type: mongoose.Schema.Types.Date,
        default: null,
        set: function (value) {
            return value !== null && value !== undefined ? new Date(value).toISOString().split("T")[0] : value;
        },
        get: function (value) {
            return value;
        }
    },
    Remarks: {
        type: mongoose.Schema.Types.String,
        default: ""
    },
    EstimatedDRC: {
        type: mongoose.Schema.Types.Number,
        default: 0
    },
    BlanketWeight: {
        type: mongoose.Schema.Types.Number,
        default: 0
    },
    StorageLocation_Detail: [{
        ref: 'StorageLocation_Detail',
        type: mongoose.Schema.Types.ObjectId
    }],
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
