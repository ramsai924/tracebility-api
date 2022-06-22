const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');

function decimalConverter(value) {
    return parseFloat(value);
}

const schema = new Schema(
    {
        Factory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Factory",
            required: [true, "Factory cannot be empty."],
            default: null,
            set: function (value) {
                return value === "" ? null : value;
            },
            get: function (value) {
                return value === null ? "" : value;
            }
        },
        Buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Buyer",
            required: [true, "Buyer cannot be empty."],
            default: null,
            set: function (value) {
                return value === "" ? null : value;
            },
            get: function (value) {
                return value === null ? "" : value;
            }
        },
        ProductGrade: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductGrade",
            required: [true, "Grade cannot be empty."],
            default: null,
            set: function (value) {
                return value === "" ? null : value;
            },
            get: function (value) {
                return value === null ? "" : value;
            }
        },
        Contract: {
            type: String,
            required: [true, "Contract cannot be empty."],
        },
        Broker: {
            ref: 'Broker',
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            set: function (value) {
                return value === "" ? null : value;
            },
            get: function (value) {
                return value === null ? "" : value;
            }
        },
        BrokerContract: {
            type: mongoose.Schema.Types.String,
            default: ''
        },
        Date: {
            type: Date,
            required: [true, "Datetime cannot be empty"],
            set: function (value) {
                return new Date(value).toISOString().split("T")[0];
            },
            get: function (value) {
                return value;
            }
        },
        SINo: {
            type: String,
            required: [true, "SI No cannot be empty"],
        },
        BuyerRef: {
            type: String,
            default: ""
        },
        Weight: {
            type: Number,
            default: 0
        },
        GrossWeight: {
            type: Number,
            default: 0
        },
        PackingType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PackingType",
            required: [true, "Packing type cannot be empty."],
            default: null,
            set: function (value) {
                return value === "" ? null : value;
            },
            get: function (value) {
                return value === null ? "" : value;
            }
        },
        NumberOfPallet: {
            type: Number,
            default: 0
        },
        ETD: {
            type: Date,
            required: [true, "Estimated of departure cannot be empty"],
            set: function (value) {
                return new Date(value).toISOString().split("T")[0];
            },
            get: function (value) {
                return value;
            }
        },
        ETA: {
            type: Date,
            required: [true, "Estimated of arrival cannot be empty"],
            set: function (value) {
                return new Date(value).toISOString().split("T")[0];
            },
            get: function (value) {
                return value;
            }
        },
        Destination: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Destination",
            required: [true, "Destination cannot be empty."],
            default: null,
            set: function (value) {
                return value === "" ? null : value;
            },
            get: function (value) {
                return value === null ? "" : value;
            }
        },
        CargoReadyDate: {
            type: Date,
            set: function (value) {
                if (value !== null) {
                    return new Date(value).toISOString().split("T")[0];
                } else {
                    return null;
                }
            },
            get: function (value) {
                return value;
            }
        },
        Vessel: {
            type: String,
            default: ""
        },
        FeederVessel: {
            type: String,
            default: ""
        },
        PortOfShipment: {
            type: String,
            default: ""
        },
        Freight: {
            type: String,
            default: ""
        },
        LoadingMarks: {
            type: String,
            default: ""
        },
        OtherMarks: {
            type: String,
            default: ""
        },
        ShippingMarkStatus: {
            type: Boolean,
            default: false
        },
        AdditionalMarkStatus: {
            type: Boolean,
            default: false
        },
        PG_IMP_Code: {
            type: String,
            default: ""
        },
        NIF: {
            type: String,
            default: ""
        },
        PlantCode: {
            type: String,
            default: ""
        },
        Remarks: {
            type: String,
            default: ""
        },
        SIStatus: { //change to CLOSE once the SI is fully assigned by pallet/SI.
            type: mongoose.Schema.Types.String,
            default: 'OPEN'
        },
        AllocationStatus: {
            type: String,
            default: "OPEN" //1 OPEN, 2, PARTIAL, 3 STUFFED
        },
        ShipStatus: {
            type: Boolean,
            default: false
        },
        ShipDate: {
            type: Date,
            set: function (value) {
                if (value !== null) {
                    return new Date(value).toISOString().split("T")[0];
                } else {
                    return null;
                }
            },
            get: function (value) {
                return value;
            }
        },
        ActualShippedDate: {
            type: Date,
            set: function (value) {
                if (value !== null) {
                    return new Date(value).toISOString().split("T")[0];
                } else {
                    return null;
                }
            },
            get: function (value) {
                return value;
            }
        },
        LoadType: {
            type: String,
            default: "Lot"  //Lot or Pallet
        },
        CoQNumber: {
            type: String,
            default: ""
        },
        CoQDate: {
            type: Date,
            set: function (value) {
                if (value !== null) {
                    return new Date(value).toISOString().split("T")[0];
                } else {
                    return null;
                }
            },
            default:null
        },
        TestResultValidity: {
            type: Number,
            default: 0  //Lot or Pallet
        },
        LabHead: {
            type: String,
            default: ""
        },
        IncludeMooney: {
            type: Boolean,
            default: false
        },
        PalletNetQty:{
          type: mongoose.SchemaTypes.Decimal128,
          default: 0.00,
          get: decimalConverter,
          set: decimalConverter
        },
        NumberOfPallets:{
            type: mongoose.SchemaTypes.Number,
            default: 0,
        },
        GrossQty:{
            type: mongoose.SchemaTypes.Decimal128,
            default: 0.00,
            get: decimalConverter,
            set: decimalConverter
        },
        Deleted: {
            type: Boolean,
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
