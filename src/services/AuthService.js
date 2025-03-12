const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/Users");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "1h" }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

const verifyToken = (req, res, next) => {
  console.log("Middleware executed");

  let token = req.cookies?.accessToken;
  
  // If no cookie token, try Authorization header
  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      token = authHeader.split(' ')[1];
    }
  }

  // No token found in either place
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Access Denied - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Invalid Token");
    return res.status(403).json({ message: "Invalid Token" });
  }
};


const register = async (req, res) => {
  const { name ,firstname ,mail , phone , password ,birth_date , CIN,gender , role_id , status } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name ,firstname ,mail , phone , hashedPassword ,birth_date , CIN,gender , role_id , status });
  await user.save();
  res.json("User registered");
};

const login = async (req, res) => {
  const { mail, password } = req.body;
    const user = await User.findOne({ mail });
    if (!user) return res.status(400).json("User not found");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json("Invalid password");

  const { accessToken, refreshToken } = generateTokens(user);
  res.cookie("accessToken", accessToken, { httpOnly: true });
  res.cookie("refreshToken", refreshToken, { httpOnly: true });
  res.json({ accessToken, refreshToken, userId: user._id });
};

const refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json("No refresh token");

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json("Invalid refresh token");
    const user = await User.findById(decoded.id);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", newRefreshToken, { httpOnly: true });
    res.json({ accessToken, refreshToken: newRefreshToken });
  });
};

const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.clearCookie("userId");
  res.json("Logged out");
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  verifyToken
};
