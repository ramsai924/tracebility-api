const mongoose = require('mongoose');
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');
const RMGradeDetail = require('./sub-document/rmGradeDetail/model');

const schema = new Schema(
    {
        Factory: {
            ref: 'Factory',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Factory cannot be empty.']
        },
        RMType: {
            ref: 'RMType',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Type cannot be empty.']
        },
        Code: {
            type: mongoose.Schema.Types.String,
            required: [true, 'Code cannot be empty.']
        },
        Name: {
            type: mongoose.Schema.Types.String,
            required: [true, 'Name cannot be empty.']
        },
        Remarks: {
            type: mongoose.Schema.Types.String,
            default: ''
        },
        Inactive: {
            type: mongoose.Schema.Types.Boolean,
            default: false
        },
        RMGradeDetail: [RMGradeDetail.schema],
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
