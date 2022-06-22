

const mongoose = require("mongoose");
const { schema } = require("./schema");

module.exports = mongoose.model("ProductGradeGroup", schema, "ProductGradeGroup");