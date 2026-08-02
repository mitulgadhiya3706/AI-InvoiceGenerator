const express = require("express");

const { registerUser, loginUser, getMe, updateUserProfile } = require("../controllers/auth.controller")

const protect = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.route("/me")
    .get(protect, getMe)
    .put(protect, updateUserProfile);

module.exports = router;