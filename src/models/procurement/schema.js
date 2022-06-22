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
        Country: {
            ref: 'Country',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Country cannot be empty.'],
            default: null
        },
        Province: {
            ref: 'Province',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Province cannot be empty.'],
            default: null
        },
        District: {
            ref: 'District',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'District cannot be empty.'],
            default: null
        },
        SubDistrict: {
            ref: 'SourceArea',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Supply origin cannot be empty.'],
            default: null
        },
        Village: {
            ref: 'RMVillage',
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        GrossWeight: {
            type: mongoose.Schema.Types.Decimal128,
            default: 0.00,
            set: decimalConverter,
            get: decimalConverter
        },
        DRC: {
            type: mongoose.Schema.Types.Decimal128,
            default: 0.00,
            set: decimalConverter,
            get: decimalConverter
        },
        /*NetWeight: {
            type: mongoose.Schema.Types.Decimal128,
            default: 0.00,
            set: decimalConverter,
            get: decimalConverter
        },*/
        Supplier: {
            ref: 'Supplier',
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        PurchasingPersonnel: {
            ref: 'PurchasingPersonnel',
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        RMGrade: {
            ref: 'RMGrade',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Factory cannot be empty.'],
        },
        StorageLocation: {
            ref: 'StorageLocation_Detail',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Storage location cannot be empty.'],
        },
        BatchNo:{
            type: mongoose.Schema.Types.String,
            default: ""
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
