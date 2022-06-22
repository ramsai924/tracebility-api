

const mongoose = require("mongoose");
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');

const schema = new Schema({
  GrpName: {
    type: String,
    required: [true]
  },
  GrpUsed: {
    type: Boolean,
  }
  
});

module.exports = { schema };
