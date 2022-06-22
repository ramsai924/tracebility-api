

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');
const DropdownBase = require('../baseschemas/dropdown-baseschema/model');

const schema = new Schema({
    Destination: {
        type: String,
        required: [true]
    },
    Country: {
        type: String,
        required: [true, 'Country cannot be Empty']
    },
    Latitude: {
        type: String,
        default: ""
    },
    Longitude: {
        type: String,
        default: ""
    },
    Inactive: {
        type: Boolean,
        default: false
    },
    Deleted: {
       type: Boolean,
       default: false
    },
    CreatedAt: {
        type: Date,
        default: ""
    },
    LastUpdatedAt:{
        type: Date,
        set: timestampToDateTime
    },
    CreatedBy: {
        type: mongoose.SchemaTypes.Mixed,
        required: [true, "Operator By cannot be empty"]
    },
    LastUpdatedBy: {
        type: mongoose.SchemaTypes.Mixed,
        required: [true, "Operator By cannot be empty"]
    }
}
   /* { timestamps: { LastUpdatedAt: true, CreatedAt: true } },*/
);


module.exports = { schema };
