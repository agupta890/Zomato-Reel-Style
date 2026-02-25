const mongoose = require("mongoose");
const StatusCode = require("../utils/status-code");
const userModel = require("../models/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }

    const normalizeEmail = email.toLowerCase()

    const existUser = await userModel.findOne({ email:normalizeEmail });
    if (existUser) {
      return res.status(StatusCode.CONFLICT).json({ message: "User already exist" });
    }
    // encrypt the password using bcrypt
    const salt = 10;
    const hash_password = await bcrypt.hash(password, salt);

    const User = await userModel.create({
      fullName,
      email:normalizeEmail,
      password: hash_password,
    });
    const userData = {
      fullName: User.fullName,
      email: User.email,
    };
    // generate jwt token
    const token = jwt.sign(
      { id: User._id, email: User.email },
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
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({message:"Internal server error",error:error})
  }
};

module.exports = Register;
