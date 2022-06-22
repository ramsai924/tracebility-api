

const mongoose = require("mongoose");
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');

const schema = new Schema({
        HSMaster: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HSMaster",
            required: [true, "HS master cannot be empty."]
        },
        Period: {
            type: String,
            required: [true, "Period cannot be empty."],
        },
        LastNumbering: {
            type: Number,
            default: 0
        },
        NumberRepeat: {   //used for config period format yyyy(3), yyyyMM(2), yyyyMMdd(1)
            type: Number,
            required: [true, "Number repeat cannot be empty."],
            default: 2
        },
        NumberResult: {
            type: String,
            required: [true, "Number result cannot be empty."],
        },
        CurrentCapacity: {
            type: Number,
            required: [true, "Capacity cannot be empty."],
        },
        //status full/ status empty?   0: Empty, 1: Partial /Fill, 2: Closed
        StatusFull: {
            type: Number,
            default: 0
        },
        StatusEmpty: {
            type: Number,
            default: 0
        },
        ClosedRemarks: {
            type: String,
            default: ""
        }
    }, {
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
