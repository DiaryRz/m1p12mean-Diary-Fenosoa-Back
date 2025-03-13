const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "1h" }
  );
}

function decodeToken(token) {
  try {
    var decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    return decoded;
  } catch (err) {
    return err;
  }
}

module.exports = { generateAccessToken, decodeToken };
