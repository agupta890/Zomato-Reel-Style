const mongoose = require("mongoose");
const StatusCode = require("../utils/status-code");
const userModel = require("../models/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register controller
const Register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }

    const normalizeEmail = email.toLowerCase();

    const existUser = await userModel.findOne({ email: normalizeEmail });
    if (existUser) {
      return res
        .status(StatusCode.CONFLICT)
        .json({ message: "User already exist" });
    }
    // encrypt the password using bcrypt
    const salt = 10;
    const hash_password = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      fullName,
      email: normalizeEmail,
      password: hash_password,
    });
    const userData = {
      fullName: user.fullName,
      email: user.email,
    };
    // generate jwt token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    return res
      .status(StatusCode.CREATED)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ message: "User register succesfull", data: userData });
  } catch (error) {
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error });
  }
};

// Login controller
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
      .status(StatusCode.BAD_REQUEST)
      .json({ message: "All fields are required" });
    }
    // check user is available
    const normalizeEmail = email.toLowerCase();
    const user = await userModel.findOne({ email: normalizeEmail });
    if (!user) {
      return res
        .status(StatusCode.CONFLICT)
        .json({ message: "user not found" });
    }
    // compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(StatusCode.CONFLICT)
        .json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(StatusCode.OK)
      .json({ message: "Login successfull", data:{id:user._id,email:user.email,fullName:user.fullName}});
  } catch (error) {
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { Register, Login };
