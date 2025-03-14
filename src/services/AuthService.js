const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const userService = require("../services/UserService");
const { generateAccessToken, decodeToken } = require("../utils/jwt.js");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "1h" },
  );
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" },
  );
  return { accessToken, refreshToken };
};

const verifyToken = (req, res, next) => {
  let token = req.cookies?.accessToken;

  // If no cookie token, try Authorization header
  if (!token) {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      token = authHeader.split(" ")[1];
    }
  }

  // No token found in either place
  if (!token) {
    console.log("No token provided");
    return res
      .status(401)
      .json({ message: "Access Denied - No token provided", ok: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Invalid Token");
    return res.status(403).json({ message: "Invalid Token", ok: false });
  }
};

const register = async (req, res) => {
  const {
    name,
    firstname,
    mail,
    phone,
    password,
    birth_date,
    CIN,
    gender,
    role_id,
  } = req.body;
  try {
    const user_exist = await userService.userExist([
      { mail: mail },
      { CIN: CIN },
      { phone: phone },
    ]);
    if (user_exist) {
      const field_taken = {
        mail: user_exist.mail == mail,
        CIN: user_exist.CIN == CIN,
        phone: user_exist.phone == phone,
      };
      return res.status(409).json({
        message: "This user alredy exist",
        field: field_taken,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de l'ajout de la personne", error });
  }

  try {
    const user = await userService.createUser({
      name,
      firstname,
      mail,
      phone,
      password,
      birth_date,
      CIN,
      gender,
      role_id,
    });

    const token = generateAccessToken({
      id: user._id,
      role: user.role,
    });
    res.status(201).cookie("accessToken", token).json({ accessToken: token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout de la personne", error });
  }
};

const login = async (req, res) => {
  const { mail, password, role } = req.body;
  const user = await User.findOne({ mail, role_id: role });
  if (!user)
    return res.status(400).json({
      message: "User not found",
      error: { mail: true, phone: true, password: false },
    });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).json({
      message: "Invalid password",
      error: { mail: false, phone: false, password: true },
    });

  const { accessToken, refreshToken } = generateTokens(user);
  res.cookie("accessToken", accessToken, { httpOnly: true });
  res.cookie("refreshToken", refreshToken, { httpOnly: true });
  res.cookie("user_id", user._id, { httpOnly: true });
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
  verifyToken,
};
