const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const userService = require("../services/UserService");
const { cookie_config, get_xcookie, set_xcookie } = require("./cookie.utils");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role_id },
    process.env.ACCESS_SECRET,
    { expiresIn: "1h" },
  );
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role_id },
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
  return token;
};

const verifyToken = (req, res, next) => {
  let token = get_token(req, "accessToken");

  if (!token) {
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
  const user = await User.findOne({
    mail: mail,
    role_id: { $in: roles },
    status: 0,
  }).populate({ path: "role_id" });

  if (!user)
    return res.status(400).json({
      message: "User not found",
      error: { mail: true, phone: true, password: false },
    });

  const validpassword = await bcrypt.compare(password, user.password);
  if (!validpassword)
    return res.status(400).json({
      message: "invalid password",
      error: { mail: false, phone: false, password: true },
    });

  const { accessToken, refreshToken } = generateTokens(user);
  res.json({ accessToken, refreshToken, userId: user._id });
};

const refresh = async (req, res) => {
  // Get both refreshToken and accessToken from the request
  const refreshToken = get_token(req, "refreshToken");
  const accessToken = get_token(req, "accessToken"); // Add this line

  if (!refreshToken || !accessToken) {
    return res.status(401).json({
      success: false,
      message: "Both access and refresh tokens are required",
    });
  }

  try {
    // Verify refresh token (must be valid)
    const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    // Verify access token (ignore expiration)
    const decodedAccess = jwt.verify(accessToken, process.env.ACCESS_SECRET, {
      ignoreExpiration: true,
    });

    // Check if user exists
    const user = await User.findById(decodedRefresh.id); // or decodedAccess.id
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Only regenerate if access token is expired
    const isAccessTokenExpired = Date.now() >= decodedAccess.exp * 1000;
    if (!isAccessTokenExpired) {
      return res.status(200).json({
        success: true,
        regenerate: false,
        message: "Access token is still valid",
      });
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      generateTokens(user);

    return res.json({
      success: true,
      regenerate: true,
      accessToken: newAccessToken,
      userId: user._id,
    });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(403).json({
        success: false,
        error: { expire_refresh: true },
        message: "Refresh token expired",
      });
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }

    console.error("Refresh token error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error during token refresh",
    });
  }
};

const logout = (req, res) => {
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
