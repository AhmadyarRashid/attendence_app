const express = require("express");
const router = express.Router();
const db = require("../helpers/db");
const { getFailureResponse, getSuccessResponse } = require("../helpers/response");

router.use("/users", require("./user.routes"));

module.exports = router;
