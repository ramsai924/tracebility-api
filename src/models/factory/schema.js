const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { timestampToDateTime } = require('../../services/app-serviceworkers');

function decimalConverter(value){
    return parseFloat(value);
}

const schema = new Schema(
    {
        FctyCode: {
            type: String,
            required: [true]
        },
        FctyName: {
            type: String,
            required: [true]
        },
        FctyRegion: {
          type: String,
          required: [true]
        },
        FctyAddr1: {
            type: String,
            default: ""
        },
        FctyAddr2: {
            type: String,
            default: ""
        },
        FctyAddr3: {
            type: String,
            default: ""
        },
        FctyCity: {
            type: String,
            default: ""
        },
        FctyProvince: {
            ref: 'Province',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Province Name cannot be empty."]
        },
        FctyCountry: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Country",
            required: [true, "Factory country cannot be empty."],
            default: null,
            set: function (value) {
                return value === "" ? null : value;
            },
            get: function (value) {
                return value === null ? "" : value;
            }
        },
        FctyZIP: {
            type: String,
            default: ""
        },
        FctyOffAddr1: {
            type: String,
            default: ""
        },
        FctyOffAddr2: {
            type: String,
            default: ""
        },
        FctyOffAddr3: {
            type: String,
            default: ""
        },
        FctyOffCity: {
            type: String,
            default: ""
        },
        FctyOffProvince: {
            ref: 'Province',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Province Name cannot be empty."]
        },
        FctyOffCountry: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Country",
            required: [true, "Factory office country cannot be empty."],
            default: null,
            set: function (value) {
                return value === "" ? null : value;
            },
            get: function (value) {
                return value === null ? "" : value;
            }
        },
        FctyOffZIP: {
            type: String,
            default: ""
        },

        FctyBrch: {
            required: [true],
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch"
        },
        FctyBusinessType: {
            type: Number,
            default: null
        },
        FctyAreaSize: {
            type: Number,
            default: 0
        },
        FctyRatedCapacity: {
            type: Number,
            default: 0
        },
        FctyProcessType: {
            type: Number,
            default: null
        },
        FctyProcessTypeAfterDrying: {
            type: Number,
            default: null
        },
        FctyLat: {
            type: mongoose.Schema.Types.Decimal128,
            default: 0,
            get:decimalConverter,
            set:decimalConverter
        },
        FctyLng: {
            type:  mongoose.Schema.Types.Decimal128,
            default: 0,
            get:decimalConverter,
            set:decimalConverter
        },
        FctyEstablished: {
            type: Date,
            default: new Date(Date.now())
        },
        FctyAcquisition: {
            type: Date,
            default: new Date(Date.now())
        },
        FctyRemarks: {
            type: String,
            default: ""
        },
        FctyInactive: {
            type: Boolean,
            default: false
        },
        FctyDeleted: {
            type: Boolean,
            default: false
        },
        FctyCreatedAt: {
           type: Date,
            set: timestampToDateTime
        },
        FctyLastUpdatedAt: {
           type: Date,
           set: timestampToDateTime
        },
        FctyCreatedBy: {
            type: mongoose.SchemaTypes.Mixed,
            required: [true, "Operator By cannot be empty"]
        },
        FctyLastUpdatedBy: {
            type: mongoose.SchemaTypes.Mixed,
            required: [true, "Operator By cannot be empty"]
        },
        Display_SubFactory: {
            type: Boolean,
            default: true
        },
        Display_RM_Supplier: {
            type: Boolean,
            default: true
        },
        Display_RM_Personal: {
            type: Boolean,
            default: true
        },
        Display_RM_Personal_LabelName: {
            type: String,
            default: ''
        },
        Display_RM_DRC: {
            type: Boolean,
            default: true
        },
        Display_RM_NetQty: {
            type: Boolean,
            default: true
        },
        Display_PR_RLot: {
            type: Boolean,
            default: true
        },
        Display_BlanketQty_LabelName: {
            type: String,
            default: ''
        },
        AccessCode: {
            type: String,
            default:''
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
