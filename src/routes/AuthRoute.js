const express = require("express");
const router = express.Router();
const authService = require("../services/AuthService");

router.post("/register", authService.register);

router.post("/login", authService.login);

router.get("/refresh", authService.refresh);

router.get("/logout", authService.verifyToken, authService.logout);

router.get("/protected", authService.verifyToken, (req, res) => {
  res.json({ ok: true });
});

module.exports = router;
