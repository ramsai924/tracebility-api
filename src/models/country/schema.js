const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {
  timestampToDateTime,
  toDateToTimeStamp,
} = require('../../services/app-serviceworkers');

const schema = new Schema({
  name: {
    type: String,
    required: [true],
  },
  remarks: {
    type: String,
    default: '',
  },
  inactive: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    set: timestampToDateTime,
  },
  lastUpdatedAt: {
    type: Date,
    set: timestampToDateTime,
  },
  createdBy: {
    type: mongoose.SchemaTypes.Mixed,
    required: [true, 'Operator By cannot be empty'],
  },
  lastUpdatedBy: {
    type: mongoose.SchemaTypes.Mixed,
    required: [true, 'Operator By cannot be empty'],
  },
});

module.exports = { schema };
