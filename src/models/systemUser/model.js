const mongoose = require("mongoose");
const { schema } = require("./schema");

module.exports = mongoose.model("SystemUser_tracebility_api", schema, "SystemUser_tracebility_api");