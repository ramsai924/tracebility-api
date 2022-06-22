

const mongoose = require("mongoose");
const { schema } = require("./schema");

module.exports = mongoose.model("HSMaster_Detail", schema, "HSMaster_Detail");