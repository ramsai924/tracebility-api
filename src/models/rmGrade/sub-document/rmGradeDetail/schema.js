const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { timestampToDateTime, toDateToTimeStamp } = require('../../../../services/app-serviceworkers');

const schema = new Schema(
    {
        CriteriaName: {
            type: mongoose.Schema.Types.String,
            required: [true, 'Criteria name cannot be empty.']
        },
        AcceptanceStd: {
            type:mongoose.Schema.Types.String,
            required: [true, 'Acceptance standard cannot be empty.']
        },
        Description:{
            type: mongoose.Schema.Types.String,
            default:""
        },
        Inactive: {
            type: mongoose.Schema.Types.Boolean,
            default: false
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
module.exports = { schema };