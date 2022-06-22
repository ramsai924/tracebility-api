

const mongoose = require('mongoose');
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');

const schema = new Schema(
    {
        ShippingInstruction: {
            ref: 'ShippingInstruction',
            type: mongoose.Schema.Types.ObjectId,
            default:null,
            set: function (value) {
                return value === "" ? null : value;
            },
            get: function (value) {
                return value === null ? "" : value;
            }
        },
        Factory: {
            ref: 'Factory',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Factory cannot be Empty']
        },
        LotDate: {
            type: mongoose.Schema.Types.Date,
            required: [true, 'Lot Date cannot be Empty']
        },
        ProductGrade: {
            ref: 'ProductGrade',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Product Grade cannot be Empty']
        },
        PackingType: {
            ref: 'PackingType',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Packing Type cannot be Empty']
        },
        LotNumber: {
            type: mongoose.Schema.Types.String,
            required: [true, 'Lot number cannot be Empty']
        },

        LotWeight: {
            type: mongoose.Schema.Types.Number,
            default: 0.00,
        },

        Remarks: {
            type: mongoose.Schema.Types.String,
            default: ''
        },
        LotStatus: { //change to CLOSE once the lot is fully assigned by pallet.
            type: mongoose.Schema.Types.String,
            default: 'OPEN'
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
