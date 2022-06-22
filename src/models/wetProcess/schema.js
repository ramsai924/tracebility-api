const mongoose = require('mongoose');
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');
const CommonModel = require('../baseschemas/commonmmodel-baseschema/model');

function decimalConverter(value){
    return parseFloat(value);
}

const schema = new Schema(
    {
        Factory: {
            ref: 'Factory',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Factory cannot be empty.'],
            default: null
        },
        WBNo:{
            type: mongoose.Schema.Types.String,
            default: ""
        },
        Date: {
            type: mongoose.Schema.Types.Date,
            required: [true, "Date cannot be empty."],
            default: Date.now()
        },
        ProcessTime : {
            type: mongoose.Schema.Types.Date,
            required: [true, "Date cannot be empty."],
            default: Date.now()
        },
        Shift : {
            ref: 'Shift',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Province cannot be empty.'],
            default: null
        },
        RLot: {
            ref: 'RLot',
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        SendTo: CommonModel.schema,
        Closed:{
            type: mongoose.Schema.Types.Boolean,
            default: false
        },
        ClosedRemarks: {
            type: String,
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
