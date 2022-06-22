const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { timestampToDateTime } = require('../../services/app-serviceworkers');

const schema = new Schema({
  Province: {
    ref: 'Province',
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Province Name cannot be empty."]
  },
  Country: {
    ref: 'Country',
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Country cannot be empty."]
  },
  Name: {
    type: mongoose.Schema.Types.String,
    required: [true, "Name cannot be empty."]
  },
  Description: {
    type: mongoose.Schema.Types.String,
    default: ""
  },
  Lat: {
    type: mongoose.Schema.Types.Number,
    default: 0
  },
  Long: {
    type: mongoose.Schema.Types.Number,
    default: 0
  },
  Inactive: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  Deleted: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  CreatedAt: {
    type: Date,
    set : timestampToDateTime
  },
  CreatedBy: {
    type: mongoose.SchemaTypes.Mixed,
    required: [true, "Operator By cannot be empty"]
  },
  LastUpdatedAt: {
    type: Date,
    set : timestampToDateTime
  },
   LastUpdatedBy: {
     type: mongoose.SchemaTypes.Mixed,
     required: [true, "Operator By cannot be empty"]
  }
 },
  {
    toObject: {
    getters: true,
        versionKey: false,
        transform: (doc, ret) => {
      return ret;
    }
  }
});

module.exports = { schema };
