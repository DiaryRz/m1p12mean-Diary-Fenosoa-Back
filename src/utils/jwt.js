const jwt = require("jsonwebtoken");

function generateAccessToken(data, expire) {
  if (expire === undefined) expire = "3600s";
  return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: expire });
}

function decodeToken(token) {
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded;
  } catch (err) {
    return err;
  }
}

module.exports = { generateAccessToken, decodeToken };
