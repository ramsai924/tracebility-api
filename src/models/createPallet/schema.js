const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { timestampToDateTime } = require('../../services/app-serviceworkers');

function decimalConverter(value) {
    return parseFloat(value);
}

const schema = new Schema(
    {
        Factory: {
            ref: 'Factory',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Factory cannot be Empty']
        },
        ProductionDate: {
            type: mongoose.Schema.Types.Date,
            required: [true, 'Production Date cannot be Empty']
        },
        ProductGrade: {
            ref: 'ProductGrade',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Product Grade cannot be Empty']
        },
        SeqPallet: {
            type: mongoose.Schema.Types.String,
            required: [true, 'Seq. Pallet cannot be Empty']
        },
        ExportPallet: {
            type: mongoose.Schema.Types.String,
            default:"",
           // required: [true, 'Export Pallet cannot be Empty']
        },
        PackingType: {
            ref: 'PackingType',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Packing Type cannot be Empty']
        },
        PalletWeight: {
            type: mongoose.Schema.Types.Decimal128,
            default: 0.00,
            get: decimalConverter,
            set: decimalConverter
        },
        PrintLabelStatus: {
            type: mongoose.Schema.Types.Boolean,
            default: true
        },
        PrintQRCodeStatus: {
            type: mongoose.Schema.Types.Boolean,
            default: false
        },
        PalletStatus: {
            type: mongoose.Schema.Types.String,
            default: 'In Process'   //In Process, Ready Process, Ready Export, Allocated, Shipped
        },
        AllocationStatus: {
            type: mongoose.Schema.Types.String,
            default: 'OPEN'
        },
        DefaultTestResult: {
            type: mongoose.Schema.Types.Number,
            required: [true, 'Default Test Result cannot be Empty'],
            default: 0
        },
        BarCodeData: {
            type: mongoose.Schema.Types.Buffer,
        },
        QRCodeData: {
            type: mongoose.Schema.Types.Buffer,
        },
        InActive: {
            type: mongoose.Schema.Types.Boolean,
            default: false
        },
        Lot: {
            ref: 'Lot',
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            set: function (value) {
                return value === "" ? null : value;
            },
            get: function (value) {
                return value === null ? "" : value;
            }
        },
        ShippingInstruction: {
            ref: 'ShippingInstruction',
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            set: function (value) {
                return value === "" ? null : value;
            },
            get: function (value) {
                return value === null ? "" : value;
            }
        },
        TestDate:{
            type: mongoose.Schema.Types.Date,
            set: function (value) {
                if (value !== null) {
                    return new Date(value);
                } else {
                    return null;
                }
            }
        },
        TestResultStatus: {
            type: mongoose.Schema.Types.Boolean,
            default: false,
        },
        BuyerLotNo: {
            type: mongoose.Schema.Types.String,
            default: ''
        },
        Remarks:{
            type: mongoose.Schema.Types.String,
            default: ''
        },
        Deleted: {
            type: mongoose.Schema.Types.Boolean,
            default: false
        },
        CreatedAt: {
            type: Date,
           /* set: timestampToDateTime*/
            set: function (value) {
                if(value instanceof  Date){
                    return value;
                }else{
                    return new Date(parseInt(value) * 1000);
                }
            },
        },
        CreatedBy: {
            type: mongoose.SchemaTypes.Mixed,
            required: [true, "Operator By cannot be empty"]
        },
        LastUpdatedAt: {
            type: Date,
            set: function (value) {
                if(value instanceof  Date){
                    return value;
                }else{
                    return new Date(parseInt(value) * 1000);
                }
            },
           /* set: timestampToDateTime*/
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
