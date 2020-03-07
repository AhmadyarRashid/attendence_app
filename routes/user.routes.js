const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// routes
router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/checkIn", userController.checkIn);
router.post("/checkOut", userController.checkOut);
router.post("/getAllDataById", userController.getAllDataById);

module.exports = router;
