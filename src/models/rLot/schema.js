const mongoose = require('mongoose');
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');

const schema = new Schema(
    {
        Factory: {
            ref: 'Factory',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Factory cannot be empty.']
        },
        LotNumber: {
            type: mongoose.Schema.Types.String,
            required: [true, 'R Lot cannot be empty.']
        },
        Date: {
            type: mongoose.Schema.Types.Date,
            required: [true, 'R Lot date cannot be empty.'],
            set: function (value) {
                return new Date(value).toISOString().split("T")[0];
            },
            get: function (value) {
                return value;
            }
        },
        RMGrade: {
            ref: 'RMGrade',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Factory cannot be empty.']
        },
        Allocated: {
            type: mongoose.Schema.Types.Boolean,
            default: false
        },
        Inactive: {
            type: mongoose.Schema.Types.Boolean,
            default: false
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
