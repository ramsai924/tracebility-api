const mongoose = require('mongoose');
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');

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
        Date: {
            type: mongoose.Schema.Types.Date,
            required: [true, "Date cannot be empty."],
            default: Date.now()
        },
        Shift: {
            ref: 'Shift',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Shift cannot be empty.'],
            default: null
        },
        HSMaster_Detail: {
            ref: 'HSMaster_Detail',
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        RMWetProcess: {
            ref: 'RMWetProcess',
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        // Balance: {
        //     type: mongoose.Schema.Types.Decimal128,
        //     default: 0.00,
        //     set: decimalConverter,
        //     get: decimalConverter
        // },
        BlanketQty: {
            type: mongoose.Schema.Types.Decimal128,
            default: 0.00,
            set: decimalConverter,
            get: decimalConverter
        },
        Remarks:{
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
