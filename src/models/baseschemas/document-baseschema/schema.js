

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        name: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: ''
        },
        data: {
            type: mongoose.Schema.Types.Buffer,
            default: null
        }
    });

module.exports = { schema };