const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const userService = require("../services/UserService");
const { cookie_config, get_xcookie, set_xcookie } = require("./cookie.utils");

const generateTokens = (user) => {
  //console.log("generateTokens");
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

const get_token = (req, token_name) => {
  let token = null;
  if (!token) {
    token = get_xcookie(req, token_name);
  }
  if (!token && token_name !== "accessToken") {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      token = authHeader.split(" ")[1];
    }
  }
  if (!token) {
    token = req.cookies?.[token_name];
  }
  // console.log(token_name + ": " + token);
  return token;
};

const verifyToken = (req, res, next) => {
  let token = get_token(req, "accessToken");

  if (!token) {
    //console.log("No token provided");
    return res
      .status(401)
      .json({ message: "Access Denied - No token provided", success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token", success: false });
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
    if (user_exist.exist) {
      const field_taken = {
        mail: user_exist.user.mail == mail,
        CIN: user_exist.user.CIN == CIN,
        phone: user_exist.user.phone == phone,
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

    res.status(201).json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout de la personne", error });
  }
};

const login = async (req, res) => {
  const { mail, password, roles } = req.body;
  // console.log(roles);
  const user = await User.findOne({
    mail: mail,
    role_id: { $in: roles },
    status: 0,
  });
  if (!user)
    return res.status(400).json({
      message: "User not found",
      error: { mail: true, phone: true, password: false },
    });

  // console.log(user);
  const validpassword = await bcrypt.compare(password, user.password);
  if (!validpassword)
    return res.status(400).json({
      message: "invalid password",
      error: { mail: false, phone: false, password: true },
    });

  const { accessToken, refreshToken } = generateTokens(user);
  res
    /* .cookie("accessToken", accessToken, cookie_config)
    .cookie("refreshToken", refreshToken, cookie_config) */
    .json({ accessToken, refreshToken, userId: user._id });
};

const refresh = async (req, res) => {
  let refreshToken = get_token(req, "refreshToken");

  if (!refreshToken)
    return res
      .status(401)
      .json({ message: "No refresh token", success: false });
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    if (!decoded) {
      return res.status(403).json("Invalid refresh token");
    }
    const user = await User.findById(decoded.id);

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    /* res.cookie("accessToken", accessToken, cookie_config);
    res.cookie("refreshToken", newRefreshToken, cookie_config); */
    return res.json({
      accessToken,
      refreshToken: newRefreshToken,
      userId: decoded.id,
    });
    return res.status(401).json({
      msg: "Invalid Token",
    });
  } catch (err) {
    //console.log("Invalid Token");
    return res.status(403).json({ message: "Invalid Token", success: false });
  }
};

const logout = (req, res) => {
  //console.log("logout");
  res.clearCookie("accessToken", cookie_config);
  res.clearCookie("refreshToken", cookie_config);
  res.json("Logged out");
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  verifyToken,
};
