const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const dotenv = require('dotenv').config();
const userService = require("../services/UserService");

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
  try {
    const { name, firstname, mail, phone, password, birth_date, CIN, gender, role_id, status } = req.body;
    
    console.log("Starting registration process");
    
    // Validate required fields
    if (!mail || !phone || !CIN || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check user existence with detailed logging
    console.log("Checking user existence...");
    const user_exist = await userService.userExist([
      { mail },
      { CIN },
      { phone }
    ]);
    console.log("User exist check result:", user_exist);

    if (user_exist) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(parseInt(process.env.hash_salt));
    const password_hash = await bcrypt.hash(password, salt);

    // Create new user object
    const newUser = {
      name,
      firstname,
      mail,
      phone,
      password: password_hash,
      birth_date,
      CIN,
      gender,
      role_id,
      status
    };

    const result = await userService.createUser(newUser);
    return res.status(201).json(result);

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
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
