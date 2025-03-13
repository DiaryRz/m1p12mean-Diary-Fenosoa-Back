// login
// verify user if exist if not > return error
// else create a jwt token
// return the token to the client with set cookies

const bcrypt = require("bcryptjs");
const { generateAccessToken, decodeToken } = require("../utils/jwt.js");

const userService = require("../services/UserService");

class AuthController {
  async register(req, res) {
    const {
      firstname,
      lastname,
      mail,
      phone,
      password_str,
      CIN,
      birthday,
      gender,
      role,
    } = req.body;
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password_str, salt);
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
          message: "Error this user alredy exist",
          field: field_taken,
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erreur lors de l'ajout de la personne", error });
    }

    try {
      const user = await userService.addUser(
        firstname,
        lastname,
        mail,
        phone,
        password_hash,
        CIN,
        birthday,
        gender,
        role,
      );

      const token = generateAccessToken({
        login: user.phone == "" ? user.mail : user.phone,
        user_id: user._id,
      });
      res
        .status(201)
        .cookie("access_token", token)
        .json({ access_token: token });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de l'ajout de la personne", error });
    }
  }

  async login(req, res) {
    const { password_str, mail, phone } = req.body;

    //verify if access_token exist;
    // verify validity of token
    let access_token = req.cookies["access_token"];

    if (access_token) {
      const tok_val = decodeToken(access_token);
      if (!tok_val.user_id) {
        res.clearCookie("access_token");
        return res.status(401).json({ message: "access token error" });
      }
      try {
        const user = await userService.getUserById(tok_val.user_id);
        if (user) {
          return res
            .status(200)
            .json({ message: "token valid", token: tok_val });
        }
        return res.status(409).json({ message: "User not found" });
      } catch (error) {
        return res
          .status(500)
          .json({ message: `error while verifying token ${error}` });
      }
    }

    const find_user_query =
      mail === undefined ? { phone: phone } : { mail: mail };
    const user = await userService.getUser(find_user_query);

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const match = await bcrypt.compare(password_str, user.password_hash);

    if (match) {
      const token = generateAccessToken({
        login: user.phone == "" ? user.mail : user.phone,
        user_id: user._id,
        role: user.role.role_name,
      });
      return res
        .status(200)
        .cookie("access_token", token)
        .json({ access_token: token });
    }
  }

  async verify(req, res) {
    let access_token = req.cookies["access_token"];

    if (access_token) {
      const tok_val = decodeToken(access_token);
      if (!tok_val.user_id) {
        res.clearCookie("access_token");
        return res.status(401).json({ message: "access token error" });
      }
      try {
        const user = await userService.getUserById(tok_val.user_id);
        if (user) {
          return res
            .status(200)
            .json({ message: "token valid", token: tok_val });
        }
        return res.status(409).json({ message: "User not found" });
      } catch (error) {
        return res
          .status(500)
          .json({ message: `error while verifying token ${error}` });
      }
    }
    return res.status(404).json({ message: `not logged in` });
  }
}

module.exports = AuthController;

// register
