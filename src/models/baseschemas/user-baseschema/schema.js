

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        Name: {
            type: mongoose.SchemaTypes.String,
            required: [true, 'Name cannot be empty']
        },
        No: {
            type: mongoose.SchemaTypes.Number,
            required: [true, 'Value cannot be empty']
        }
    });

module.exports = { schema };