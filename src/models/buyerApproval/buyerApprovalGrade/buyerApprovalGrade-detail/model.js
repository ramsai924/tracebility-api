

const mongoose = require("mongoose");
const { schema } = require("./schema");

module.exports = mongoose.model("BuyerApprovedGrade_Detail", schema, "BuyerApprovedGrade_Detail");

