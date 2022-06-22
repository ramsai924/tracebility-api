

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { timestampToDateTime, toDateToTimeStamp } = require('../../../services/app-serviceworkers');

const schema = new Schema(
    {
        name: {
            type: mongoose.SchemaTypes.String,
            required: [true, 'name cannot be empty']
        },
        value: {
            type: mongoose.SchemaTypes.Number,
            required: [true, 'value cannot be empty']
        }
    });

module.exports = { schema };