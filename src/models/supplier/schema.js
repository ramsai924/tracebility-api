

const mongoose = require("mongoose");
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');

const schema = new Schema(
    {
        Factory: {
            ref: 'Factory',
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Factory cannot be empty.']
        },
        Code: {
            type: mongoose.Schema.Types.String,
            required: [true, "Supplier code cannot be empty."]
        },
        Name: {
            type: mongoose.Schema.Types.String,
            required: [true, "Supplier name cannot be empty."]
        },
        ContactPerson: {
            type: mongoose.Schema.Types.String,
            default:""
        },
        LicenseID: {
            type: mongoose.Schema.Types.String,
            default:""
        },
        Address1: {
            type: mongoose.Schema.Types.String,
            default:""
        },
        Address2: {
            type: mongoose.Schema.Types.String,
            default:""
        },
        Address3: {
            type: mongoose.Schema.Types.String,
            default:""
        },
        City: {
            type: mongoose.Schema.Types.String,
            default:""
        },
        State: {
            type: mongoose.Schema.Types.String,
            default:""
        },
        Country: {    // world country, data from json file
            type: mongoose.Schema.Types.Number,
            default:0
        },
        Zip: {
            type: mongoose.Schema.Types.String,
            default:""
        },
        Phone: {
            type: mongoose.Schema.Types.String,
            default:""
        },
        Email: {
            type: mongoose.Schema.Types.String,
            default:""
        },
        StartSupplyDate: {
            type: mongoose.Schema.Types.Date,
            required: [true, "Start supply date cannot be empty."],
            set: function (value) {
                return new Date(value).toISOString().split("T")[0];
            },
            get: function (value) {
                return value;
            }
        },
        Lat: {
            type: mongoose.Schema.Types.Number,
            default:0
        },
        Lng: {
            type: mongoose.Schema.Types.Number,
            default:0
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
           set: timestampToDateTime,
        },
        LastUpdatedAt: {
            type: Date,
            set: timestampToDateTime,
        },
        CreatedBy: {
            type: mongoose.SchemaTypes.Mixed,
            required: [true, "Operator By cannot be empty"]
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
