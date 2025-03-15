const express = require("express");
const router = express.Router();
const authService = require("../services/AuthService");
const verifyToken = require("../services/AuthService").verifyToken;

router.post("/register", authService.register);

router.post("/login", authService.login);

router.post("/refresh", authService.refresh);

router.post("/logout", verifyToken, authService.logout);

router.get("/protected", authService.verifyToken, (req, res) => {
  res.json(`Welcome ${req.user.role}`);
});

module.exports = router;
