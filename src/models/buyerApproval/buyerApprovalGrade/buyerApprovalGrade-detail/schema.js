const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { timestampToDateTime, toDateToTimeStamp } = require('../../../../services/app-serviceworkers');

const schema = new Schema(
    {

       POLSL: {
            type: Number,
            default: 0.0
        },
       POCenter: {
            type: Number,
            default: 0.0
        },
       POUSL: {
            type: Number,
            default: 0.0
        },
        POLCL: {
            type: Number,
            default: 0.0
        },
        POUCL: {
            type: Number,
            default: 0.0
        },

       PRILSL: {
            type: Number,
            default: 0.0
        },
       PRICenter: {
            type: Number,
            default: 0.0
        },
       PRIUSL: {
            type: Number,
            default: 0.0
        },
        PRILCL: {
            type: Number,
            default: 0.0
        },
        PRIUCL: {
            type: Number,
            default: 0.0
        },

       DirtLSL: {
            type: Number,
            default: 0.0
        },
       DirtCenter: {
            type: Number,
            default: 0.0
        },
       DirtUSL: {
            type: Number,
            default: 0.0
        },

       VMLSL: {
            type: Number,
            default: 0.0
        },
       VMCenter: {
            type: Number,
            default: 0.0
        },
       VMUSL: {
            type: Number,
            default: 0.0
        },

       AshLSL: {
            type: Number,
            default: 0.0
        },
       AshCenter: {
            type: Number,
            default: 0.0
        },
       AshUSL: {
            type: Number,
            default: 0.0
        },

       NitrogenLSL: {
            type: Number,
            default: 0.0
        },
       NitrogenCenter: {
            type: Number,
            default: 0.0
        },
       NitrogenUSL: {
            type: Number,
            default: 0.0
        },

       MooneyLSL: {
            type: Number,
            default: 0.0
        },
       MooneyCenter: {
            type: Number,
            default: 0.0
        },
       MooneyUSL: {
            type: Number,
            default: 0.0
        },
        MooneyLCL: {
            type: Number,
            default: 0.0
        },
        MooneyUCL: {
            type: Number,
            default: 0.0
        },

       AshtLSL: {
            type: Number,
            default: 0.0
        },
       AshtCenter: {
            type: Number,
            default: 0.0
        },
       AshtUSL: {
            type: Number,
            default: 0.0
        },
        Remarks: {
            type: mongoose.SchemaTypes.String,
            default: ""
        },
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
