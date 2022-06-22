

const mongoose = require("mongoose");
const Schema = mongoose.Schema; const { timestampToDateTime, toDateToTimeStamp } = require('../../services/app-serviceworkers');

const schema = new Schema({
  value: {
    type: Number,
    required: [true]
  },
  name: {
    type: String,
    required: [true, "Factory Name cannot be empty"]
  },
  deleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
    required: [true]
  },
  lastUpdated: {
    type: Date,
    default: new Date(Date.now()),
    required: [true]
  },
  createdBy: {
    type: String,
    default: "",
    required: [true]
  },
  lastUpdatedBy: {
    type: String,
    default: "",
    required: [true]
  }
});

module.exports = { schema };
