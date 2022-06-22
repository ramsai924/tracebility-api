

const mongoose = require("mongoose");
const { schema } = require("./schema");

module.exports = mongoose.model("StorageLocation_Detail", schema, "StorageLocation_Detail");