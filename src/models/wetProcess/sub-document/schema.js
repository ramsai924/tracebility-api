const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { timestampToDateTime, toDateToTimeStamp } = require('../../../services/app-serviceworkers');

function decimalConverter(value){
    return parseFloat(value);
}

const schema = new Schema(
 {
        RMWetProcess: {
            ref: 'RMWetProcess',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Wet Process cannot be empty.'],
            default: null
        },
        StorageLocation: {
            ref: 'StorageLocation_Detail',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Storage Location cannot be empty.'],
            default: null
        },
        GrossQty: {
            type: mongoose.Schema.Types.Number,
            required: [true, 'Gross Qty cannot be empty.'],
            default: 0
        },
        // Balance: {
        //     type: mongoose.Schema.Types.Number,
        //     required: [true, 'Balance cannot be empty.'],
        //     default: 0
        // },
         StatusEmpty: {
             type: mongoose.Schema.Types.Number,
             default: 0
         },
         StatusFull: {
             type: mongoose.Schema.Types.Number,
             default: 0
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
